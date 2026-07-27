import { proxyActivities, log } from '@temporalio/workflow'
import type * as activities from './activities'
import type { EnrichPhoneInput } from './activities/phoneProviders/types'

const { verifyEmail } = proxyActivities<typeof activities>({
  startToCloseTimeout: '30 seconds',
  retry: {
    maximumAttempts: 2,
  },
})

export async function verifyEmailWorkflow(email: string): Promise<boolean> {
  return await verifyEmail(email)
}

const { findPhoneViaOrionConnect, findPhoneViaAstraDialer, findPhoneViaNimbusLookup } = proxyActivities<
  typeof activities
>({
  startToCloseTimeout: '10 seconds',
  retry: {
    initialInterval: '1 second',
    backoffCoefficient: 2,
    maximumInterval: '10 seconds',
    maximumAttempts: 3,
  },
})

const { saveLeadPhoneResult, markLeadPhoneEnrichmentFailed } = proxyActivities<typeof activities>({
  startToCloseTimeout: '10 seconds',
  retry: {
    maximumAttempts: 3,
  },
})

export interface EnrichPhoneWorkflowResult {
  phone: string | null
  source: string | null
}

const phoneProviders: Array<{
  name: string
  findPhone: (input: EnrichPhoneInput) => Promise<{ phone: string | null }>
}> = [
  { name: 'orionConnect', findPhone: findPhoneViaOrionConnect },
  { name: 'astraDialer', findPhone: findPhoneViaAstraDialer },
  { name: 'nimbusLookup', findPhone: findPhoneViaNimbusLookup },
]

export async function enrichPhoneWorkflow(input: EnrichPhoneInput): Promise<EnrichPhoneWorkflowResult> {
  try {
    for (const provider of phoneProviders) {
      try {
        const { phone } = await provider.findPhone(input)
        if (phone) {
          await saveLeadPhoneResult(input.leadId, { phone, source: provider.name })
          return { phone, source: provider.name }
        }
      } catch (error) {
        // A single provider exhausting its retries shouldn't stop the chain -
        // Orion Connect in particular is documented as failing sometimes.
        log.warn(`Provider ${provider.name} failed for lead ${input.leadId}`, { error })
      }
    }

    await saveLeadPhoneResult(input.leadId, { phone: null, source: null })
    return { phone: null, source: null }
  } catch (error) {
    await markLeadPhoneEnrichmentFailed(input.leadId)
    throw error
  }
}
