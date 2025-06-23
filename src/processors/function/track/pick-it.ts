import { at } from 'fire-keeper'

import type Item from '../../../models/Item.js'
import type Scope from '../../../models/Scope.js'

export type Option = {
  countBracket: number
  hasIdentifier: boolean
  i: number
  list: Item[]
  result: Item[]
  scope: Scope
}

export const pickIt = (option: Option): [number, Item[]] => {
  const { countBracket, hasIdentifier, i, list, result, scope } = option

  const item = at(list, i)
  if (!item) return [i, result]

  result.unshift(item)

  let countBracket2 = countBracket
  if (item.is('bracket')) {
    if (item.value === '(') countBracket2 = countBracket - 1
    else countBracket2 = countBracket + 1
  }

  const hasIdentifier2 =
    ['identifier', 'super', 'this'].includes(item.type) || hasIdentifier

  if (countBracket2 === 0 && hasIdentifier2 && item.scope.isEqual(scope))
    return [i, result]

  return pickIt({
    countBracket: countBracket2,
    hasIdentifier: hasIdentifier2,
    i: i - 1,
    list,
    result,
    scope,
  })
}
