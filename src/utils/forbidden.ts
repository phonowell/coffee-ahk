import data from '../../data/forbidden.json'

/** Forbidden names list (lowercase) */
export const listForbidden = data
  .filter((item): item is string => typeof item === 'string')
  .map((item) => item.toLowerCase())

/** Check if a variable name is forbidden */
export const isVariableForbidden = (name: string): boolean => {
  const v = name.toLowerCase()
  return v.startsWith('a_') || listForbidden.includes(v)
}

/** Get reason why a name is forbidden */
export const getForbiddenReason = (name: string): string =>
  name.toLowerCase().startsWith('a_')
    ? 'A_ prefix is reserved for AHK built-in variables'
    : 'name is in forbidden list'
