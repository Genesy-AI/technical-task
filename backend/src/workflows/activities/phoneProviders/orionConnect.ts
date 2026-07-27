import { EnrichPhoneInput, PhoneProvider, PhoneProviderResult } from './types'
import { RateLimiter } from './rateLimiter'

const BASE_URL = process.env.ORION_CONNECT_BASE_URL ?? 'https://api.enginy.ai/api/tmp/orionConnect'
const AUTH_KEY = process.env.ORION_CONNECT_API_KEY ?? 'mySecretKey123'

const rateLimiter = new RateLimiter(
  Number(process.env.ORION_CONNECT_MAX_RPS) || 5,
  1000
)

export const orionConnect: PhoneProvider = {
  name: 'orionConnect',
  async findPhone(input: EnrichPhoneInput): Promise<PhoneProviderResult> {
    await rateLimiter.acquire()

    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-me': AUTH_KEY,
      },
      body: JSON.stringify({
        fullName: input.fullName,
        companyWebsite: input.companyWebsite,
      }),
    })

    if (!response.ok) {
      throw new Error(`Orion Connect request failed with status ${response.status}`)
    }

    const data = (await response.json()) as { phone: string | null }
    return { phone: data.phone || null }
  },
}
