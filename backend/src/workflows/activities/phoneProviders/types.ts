export interface EnrichPhoneInput {
  leadId: number
  fullName: string
  email: string
  jobTitle: string | null
  companyWebsite: string | null
}

export interface PhoneProviderResult {
  phone: string | null
}

export interface PhoneProvider {
  name: string
  findPhone(input: EnrichPhoneInput): Promise<PhoneProviderResult>
}
