export type LeadsCreateInput = {
  firstName: string
  lastName: string
  email: string
  linkedInUrl?: string | null
  phoneNumber?: string | null
  yearsAtCompany?: number | null
}

export type LeadsCreateOutput = {
  id: number
  firstName: string
  email: string
}
