/**
 * Internal variable naming constants.
 * Using Unicode prefix 'ℓ' (U+2113, script small l) for internal variables
 * to save characters and avoid conflicts with user code.
 */

// Function context (closure)
export const CTX = 'λ' // lambda - closure context

// Built-in helpers
export const CI = 'ℓci' // change index helper
export const TYPEOF = 'ℓtype' // typeof helper

// Temporary variables
export const ARR = 'ℓarr' // array parameter in ci
export const IDX = 'ℓidx' // index parameter in ci
export const V = 'ℓv' // value parameter in typeof
export const THIS = 'ℓthis' // this parameter replacement
export const ARRAY = 'ℓarray' // array deconstruct temp
export const OBJECT = 'ℓobject' // object deconstruct temp
export const INDEX_FOR = 'ℓi' // for loop index
export const KEY_FOR = 'ℓk' // for loop key
