// Change index function data
import Item from '../../models/Item.js'

import type Scope from '../../models/Scope'

type ItemLike = {
  type: Item['type']
  value: Item['value']
  scope: Scope['list']
}

const changeIndexData: ItemLike[] = [
  { type: 'native', value: 'global ', scope: [] },
  { type: 'identifier', value: '__ci_salt__', scope: [] },
  { type: 'sign', value: '=', scope: [] },
  { type: 'function', value: 'anonymous', scope: [] },
  { type: 'edge', value: 'parameter-start', scope: ['parameter'] },
  { type: 'identifier', value: '__ipt__', scope: ['parameter'] },
  { type: 'edge', value: 'parameter-end', scope: ['parameter'] },
  { type: 'edge', value: 'block-start', scope: ['function'] },
  { type: 'new-line', value: '1', scope: ['function'] },
  { type: 'native', value: 'if __ipt__ is Number', scope: ['function'] },
  { type: 'new-line', value: '1', scope: ['function'] },
  { type: 'native', value: '  return __ipt__ + 1', scope: ['function'] },
  { type: 'new-line', value: '1', scope: ['function'] },
  { type: 'statement', value: 'return', scope: ['function'] },
  { type: 'identifier', value: '__ipt__', scope: ['function'] },
  { type: 'new-line', value: '0', scope: ['function'] },
  { type: 'edge', value: 'block-end', scope: ['function'] },
  { type: 'new-line', value: '0', scope: [] },
]

export const changeIndex = changeIndexData.map(
  (it) => new Item(it.type, it.value, it.scope),
)
