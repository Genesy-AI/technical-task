import { prisma } from '../../prismaClient'
import { orionConnect } from './phoneProviders/orionConnect'
import { astraDialer } from './phoneProviders/astraDialer'
import { nimbusLookup } from './phoneProviders/nimbusLookup'
import { EnrichPhoneInput } from './phoneProviders/types'

export async function findPhoneViaOrionConnect(input: EnrichPhoneInput) {
  return orionConnect.findPhone(input)
}

export async function findPhoneViaAstraDialer(input: EnrichPhoneInput) {
  return astraDialer.findPhone(input)
}

export async function findPhoneViaNimbusLookup(input: EnrichPhoneInput) {
  return nimbusLookup.findPhone(input)
}

export async function saveLeadPhoneResult(
  leadId: number,
  result: { phone: string | null; source: string | null }
): Promise<void> {
  await prisma.lead.update({
    where: { id: leadId },
    data: {
      phoneNumber: result.phone,
      phoneEnrichmentStatus: result.phone ? 'found' : 'not_found',
      phoneEnrichmentSource: result.source,
    },
  })
}

export async function markLeadPhoneEnrichmentFailed(leadId: number): Promise<void> {
  await prisma.lead.update({
    where: { id: leadId },
    data: { phoneEnrichmentStatus: 'failed' },
  })
}
