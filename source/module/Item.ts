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

  /**
   * Creates a new instance of Item with the same type, value, and scope as the provided item.
   * @param item The item to clone.
   * @returns A new instance of Item with the same type, value, and scope as the provided item.
   * @throws An error if the provided item is not an instance of Item.
   */
  static clone(item: Item) {
    if (!(item instanceof Item))
      throw new Error('item must be an instance of Item')

    const { scope, type, value } = item
    return new Item(type, value, scope)
  }

  /**
   * Determines whether the provided item is an instance of Item with the specified type and value.
   * @param item The item to check.
   * @param type The type of the item to check for.
   * @param value The value of the item to check for (optional).
   * @returns True if the provided item is an instance of Item with the specified type and value, false otherwise.
   * @throws An error if the provided item is not an instance of Item.
   */
  static is(
    item: Item | undefined,
    type: (typeof listType)[number],
    value?: string,
  ): item is Item & boolean {
    if (!Item.isItem(item)) return false
    if (typeof value === 'undefined') return item.type === type
    return item.type === type && item.value === value
  }

  /**
   * Determines whether the provided input is an instance of Item.
   * @param input The input to check.
   * @returns True if the provided input is an instance of Item, false otherwise.
   */
  static isItem(input: unknown): input is Item {
    return input instanceof Item
  }

  /**
   * Determines whether two arrays of Scope objects are equal.
   * @param a The first array of Scope objects to compare.
   * @param b The second array of Scope objects to compare.
   * @returns True if the two arrays are equal, false otherwise.
   */
  static isScopeEqual(a: Scope[], b: Scope[]) {
    return a.length === b.length && a.join('|') === b.join('|')
  }

  /**
   * Creates a new instance of Item with the provided arguments.
   * If the first argument is an instance of Item, returns a clone of that item.
   * If the first argument is a string, creates a new Item instance with the provided arguments.
   * @param args The arguments to use when creating the new Item instance.
   * @returns A new instance of Item.
   * @throws An error if the provided arguments are invalid.
   */
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
