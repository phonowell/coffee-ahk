// interface

import { TScope as Scope } from './Scope'

// variable

const listType = [
  '++',
  '--',
  '.',
  'await',
  'boolean',
  'bracket', // (){}
  'class',
  'compare',
  'edge', // array-end array-start block-end block-start call-end call-start expression-end expression-start index-end index-start interpolation-end interpolation-start parameter-end parameter-start
  'error',
  'for',
  'for-in', // in of
  'function',
  'identifier',
  'if', // case default else if switch
  'logical-operator', // ! && ||
  'math',
  'native',
  'negative', // + -
  'new-line',
  'number',
  'property',
  'prototype',
  'sign', // , ... : =
  'statement', // break continue extends new return throw
  'string',
  'super',
  'this',
  'try', // catch finally try
  'void',
  'while',
] as const

// function

class Item {
  comment?: string[]
  scope: Scope[]
  type: (typeof listType)[number]
  value: string

  constructor(
    type: Item['type'] = 'void',
    value?: Item['value'],
    scope: Item['scope'] = [],
  ) {
    this.type = type
    this.value = typeof value === 'undefined' ? type : value || ''
    this.scope = [...scope]
  }

  static clone(item: Item) {
    if (!(item instanceof Item))
      throw new Error('item must be an instance of Item')
    return new Item(item.type, item.value, item.scope)
  }

  static is(
    item: Item | undefined,
    type: (typeof listType)[number],
    value?: string,
  ): item is Item & boolean {
    if (!Item.isItem(item)) return false
    if (typeof value === 'undefined') return item.type === type
    return item.type === type && item.value === value
  }

  static isItem(input: unknown): input is Item {
    return input instanceof Item
  }

  static isScopeEqual(a: Scope[], b: Scope[]) {
    return a.join('|') === b.join('|')
  }

  static new(
    ...args:
      | ConstructorParameters<typeof Item>
      | Parameters<(typeof Item)['clone']>
  ) {
    if (args[0] instanceof Item) return Item.clone(args[0])
    if (typeof args[0] === 'string')
      return new Item(...(args as ConstructorParameters<typeof Item>))
    throw new Error(`invalid item: ${JSON.stringify(args)}`)
  }
}

// export
export default Item
export type { Scope }
