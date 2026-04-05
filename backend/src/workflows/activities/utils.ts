import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getLeadById(leadId: number): Promise<{ id: number } | null> {
    const lead = await prisma.lead.findUnique({
        where: { id: leadId },
        select: { id: true },
    })
    return lead
}

export async function verifyEmail(email: string): Promise<boolean> {
    if (email.includes('john.doe')) {
        return false;
    }

    if (email.includes('jane.smith')) {
        await new Promise((resolve) => setTimeout(resolve, 20000));
    }

    if (/\+/.test(email)) {
        return false;
    }

    return true;
}

const ORION_CONNECT_URL = 'https://api.enginy.ai/api/tmp/orionConnect'
const ASTRA_DIALER_URL = 'https://api.enginy.ai/api/tmp/astraDialer'
const NIMBUS_LOOKUP_URL = 'https://api.enginy.ai/api/tmp/numbusLookup'

export async function fetchPhoneFromOrionConnect(fullName: string): Promise<string | null> {
    const response = await fetch(ORION_CONNECT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-me': 'mySecretKey123',
        },
        body: JSON.stringify({ fullName }),
    })
    if (!response.ok) {
        throw new Error(`Orion Connect responded with status ${response.status}`)
    }
    const data = (await response.json()) as { phone: string | null }
    return data.phone ?? null
}

export async function fetchPhoneFromAstraDialer(email: string): Promise<string | null> {
    const response = await fetch(ASTRA_DIALER_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            apiKey: '1234jhgf',
        },
        body: JSON.stringify({ email }),
    })
    if (!response.ok) {
        throw new Error(`Astra Dialer responded with status ${response.status}`)
    }
    const data = (await response.json()) as { phoneNmbr?: string | null }
    return data.phoneNmbr ?? null
}

export async function fetchPhoneFromNimbusLookup(email: string): Promise<string | null> {
    const url = new URL(NIMBUS_LOOKUP_URL)
    url.searchParams.set('api', '000099998888')
    const response = await fetch(url.toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    })
    if (!response.ok) {
        throw new Error(`Nimbus Lookup responded with status ${response.status}`)
    }
    const data = (await response.json()) as { number: number; countryCode: string }
    if (!data.number) return null
    return `+${data.countryCode}${data.number}`
}