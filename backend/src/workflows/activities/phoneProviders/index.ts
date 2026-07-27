import { orionConnect } from './orionConnect'
import { astraDialer } from './astraDialer'
import { nimbusLookup } from './nimbusLookup'

export * from './types'

// Order matters: providers are queried in this sequence, stopping at the
// first one that returns a phone number.
export const phoneProviders = [orionConnect, astraDialer, nimbusLookup]
