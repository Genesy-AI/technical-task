import { EnrichPhoneInput, PhoneProvider, PhoneProviderResult } from './types'
import { RateLimiter } from './rateLimiter'

const BASE_URL = process.env.ASTRA_DIALER_BASE_URL ?? 'https://api.enginy.ai/api/tmp/astraDialer'
const API_KEY = process.env.ASTRA_DIALER_API_KEY ?? '1234jhgf'

const rateLimiter = new RateLimiter(
  Number(process.env.ASTRA_DIALER_MAX_RPS) || 5,
  1000
)

export const astraDialer: PhoneProvider = {
  name: 'astraDialer',
  async findPhone(input: EnrichPhoneInput): Promise<PhoneProviderResult> {
    await rateLimiter.acquire()

    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apiKey: API_KEY,
      },
      body: JSON.stringify({
        email: input.email,
      }),
    })

    if (!response.ok) {
      throw new Error(`Astra Dialer request failed with status ${response.status}`)
    }

    const data = (await response.json()) as { phoneNmbr: string | null | undefined }
    return { phone: data.phoneNmbr || null }
  },
}
