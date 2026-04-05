export type LeadsUpdateInput = {
  id: number
  firstName: string
  email: string
  linkedInUrl?: string | null
  phoneNumber?: string | null
  yearsAtCompany?: number | null
}

export type LeadsUpdateOutput = void
