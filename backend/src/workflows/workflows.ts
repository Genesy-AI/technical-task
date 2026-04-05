import { proxyActivities, defineQuery, setHandler } from '@temporalio/workflow'
import type * as activities from './activities'

const { verifyEmail } = proxyActivities<typeof activities>({
  startToCloseTimeout: '30 seconds',
})

const { getLeadById } = proxyActivities<typeof activities>({
  startToCloseTimeout: '10 seconds',
})

const {
  fetchPhoneFromOrionConnect,
  fetchPhoneFromAstraDialer,
  fetchPhoneFromNimbusLookup,
} = proxyActivities<typeof activities>({
  startToCloseTimeout: '30 seconds',
  retry: {
    maximumAttempts: 3,
    initialInterval: '1 second',
    backoffCoefficient: 2,
  },
})

export const enrichPhoneStatusQuery = defineQuery<string>('enrichPhoneStatus')

export interface EnrichPhoneInput {
  leadId: number
  fullName: string
  email: string
}

export async function verifyEmailWorkflow(email: string): Promise<boolean> {
  return await verifyEmail(email)
}

export async function enrichPhoneWorkflow(input: EnrichPhoneInput): Promise<string | null> {
  let currentStatus = 'Starting'
  setHandler(enrichPhoneStatusQuery, () => currentStatus)

  const lead = await getLeadById(input.leadId)
  if (!lead) return null

  currentStatus = 'Querying Orion Connect'
  const orionPhone = await fetchPhoneFromOrionConnect(input.fullName)
  if (orionPhone) return orionPhone

  currentStatus = 'Querying Astra Dialer'
  const astraPhone = await fetchPhoneFromAstraDialer(input.email)
  if (astraPhone) return astraPhone

  currentStatus = 'Querying Nimbus Lookup'
  const nimbusPhone = await fetchPhoneFromNimbusLookup(input.email)
  if (nimbusPhone) return nimbusPhone

  currentStatus = 'No data found'
  return null
}
