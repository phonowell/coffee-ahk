import type Item from '../../../models/Item.js'

// would not add `return` before items return `true` in this function
export const ignore = (item: Item) => {
  if (item.is('for')) return true
  if (item.is('if')) return true
  if (item.is('native') && item.value !== '__mark:do__') return true
  if (item.is('statement') && item.value !== 'new') return true
  if (item.is('try')) return true
  if (item.is('while')) return true
  return false
}
