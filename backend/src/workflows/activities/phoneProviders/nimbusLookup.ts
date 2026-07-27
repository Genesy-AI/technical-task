import { EnrichPhoneInput, PhoneProvider, PhoneProviderResult } from './types'
import { RateLimiter } from './rateLimiter'

const BASE_URL = process.env.NIMBUS_LOOKUP_BASE_URL ?? 'https://api.enginy.ai/api/tmp/numbusLookup'
const API_KEY = process.env.NIMBUS_LOOKUP_API_KEY ?? '000099998888'

const rateLimiter = new RateLimiter(
  Number(process.env.NIMBUS_LOOKUP_MAX_RPS) || 5,
  1000
)

export const nimbusLookup: PhoneProvider = {
  name: 'nimbusLookup',
  async findPhone(input: EnrichPhoneInput): Promise<PhoneProviderResult> {
    await rateLimiter.acquire()

    const url = new URL(BASE_URL)
    url.searchParams.set('api', API_KEY)

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: input.email,
        jobTitle: input.jobTitle,
      }),
    })

    if (!response.ok) {
      throw new Error(`Nimbus Lookup request failed with status ${response.status}`)
    }

    // The docs describe the response as `{ number, countryCode }`, but the live
    // endpoint actually returns `{ phoneNmbr, countryCode }` - accept either.
    const data = (await response.json()) as {
      number?: number | null
      phoneNmbr?: number | null
      countryCode: string | null
    }
    const number = data.number ?? data.phoneNmbr

    if (number === null || number === undefined) {
      return { phone: null }
    }

    const phone = data.countryCode ? `${data.countryCode}${number}` : String(number)
    return { phone }
  },
}
