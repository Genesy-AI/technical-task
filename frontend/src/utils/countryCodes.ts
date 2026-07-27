import { whereAlpha2 } from 'iso-3166-1'

export const isValidCountryCode = (code: string): boolean => whereAlpha2(code.toUpperCase()) !== undefined
