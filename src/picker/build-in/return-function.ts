// Return function data
import Item from '../../models/Item.js'

import type Scope from '../../models/Scope'

type ItemLike = {
  type: Item['type']
  value: Item['value']
  scope: Scope['list']
}

const returnFunctionData: ItemLike[] = [
  { type: 'native', value: 'global ', scope: [] },
  { type: 'identifier', value: '__rf_salt__', scope: [] },
  { type: 'sign', value: '=', scope: [] },
  { type: 'function', value: 'anonymous', scope: [] },
  { type: 'edge', value: 'parameter-start', scope: ['parameter'] },
  { type: 'identifier', value: '__fn__', scope: ['parameter'] },
  { type: 'sign', value: ',', scope: ['parameter'] },
  { type: 'identifier', value: '__token__', scope: ['parameter'] },
  { type: 'edge', value: 'parameter-end', scope: ['parameter'] },
  { type: 'edge', value: 'block-start', scope: ['function'] },
  { type: 'new-line', value: '1', scope: ['function'] },
  { type: 'if', value: 'if', scope: ['function'] },
  { type: 'edge', value: 'expression-start', scope: ['function'] },
  { type: 'identifier', value: '__fn__', scope: ['function'] },
  { type: 'edge', value: 'expression-end', scope: ['function'] },
  { type: 'edge', value: 'block-start', scope: ['function', 'if'] },
  { type: 'new-line', value: '2', scope: ['function', 'if'] },
  { type: 'statement', value: 'return', scope: ['function', 'if'] },
  { type: 'identifier', value: '__fn__', scope: ['function', 'if'] },
  { type: 'new-line', value: '1', scope: ['function', 'if'] },
  { type: 'edge', value: 'block-end', scope: ['function', 'if'] },
  { type: 'new-line', value: '1', scope: ['function'] },
  { type: 'statement', value: 'throw', scope: ['function'] },
  { type: 'identifier', value: 'Exception', scope: ['function'] },
  { type: 'edge', value: 'call-start', scope: ['function', 'call'] },
  {
    type: 'string',
    value: '"invalid function: "',
    scope: ['function', 'call'],
  },
  { type: 'edge', value: 'interpolation-start', scope: ['function', 'call'] },
  { type: 'identifier', value: '__token__', scope: ['function', 'call'] },
  { type: 'edge', value: 'interpolation-end', scope: ['function', 'call'] },
  { type: 'string', value: '""', scope: ['function', 'call'] },
  { type: 'edge', value: 'call-end', scope: ['function', 'call'] },
  { type: 'new-line', value: '0', scope: ['function'] },
  { type: 'edge', value: 'block-end', scope: ['function'] },
  { type: 'new-line', value: '0', scope: [] },
]

export const returnFunction = returnFunctionData.map(
  (it) => new Item(it.type, it.value, it.scope),
)
