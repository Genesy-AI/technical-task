export type LeadsGetOneInput = {
  id: number
}

export type LeadsGetOneOutput = {
  id: number
  firstName: string
  email: string
  linkedInUrl?: string | null
  phoneNumber?: string | null
  yearsAtCompany?: number | null
}
