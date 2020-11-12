// interface

import { Item as Scope } from './cache'

// variable

const listType = [
  '++',
  '--',
  '.',
  'boolean',
  'bracket', // ()
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
  'negative', // + -
  'new-line',
  'number',
  'origin',
  'property',
  'prototype',
  'sign', // , ... : =
  'statement', // break continue extends new return throw
  'string',
  'this',
  'try', // catch finally try
  'void',
  'while'
] as const

// function

class Item {

  comment?: string[]
  scope: Scope[]
  type: typeof listType[number]
  value: string

  constructor(
    type: Item['type'] = 'void',
    value?: Item['value'],
    scope: Item['scope'] = []
  ) {

    this.type = type
    this.value = typeof value === 'undefined'
      ? type
      : value || ''
    this.scope = [...scope]
  }

  static clone(
    item: Item
  ): Item {

    if (!(item instanceof Item))
      throw new Error('item must be an instance of Item')

    return new Item(item.type, item.value, item.scope)
  }
}

// export
export default Item