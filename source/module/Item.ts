import at from '../utils/at'

import { KeyScope as Scope } from './Scope'

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
  static #clone(item: Item) {
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
  static #is(
    item: Item | undefined,
    type: (typeof listType)[number],
    value?: string,
  ): item is Item & boolean {
    if (!Item.#isItem(item)) return false
    if (typeof value === 'undefined') return item.type === type
    return item.type === type && item.value === value
  }

  /**
   * Determines whether the provided input is an instance of Item.
   * @param input The input to check.
   * @returns True if the provided input is an instance of Item, false otherwise.
   */
  static #isItem(input: unknown): input is Item {
    return input instanceof Item
  }

  /**
   * Determines whether two items or scopes have the same scope.
   * @param a The first item or scope to compare.
   * @param b The second item or scope to compare.
   * @returns True if the scopes are equal, false otherwise.
   */
  static #isScopeEqual(a: Item | Scope[], b: Item | Scope[]) {
    const scpA = Item.#isItem(a) ? a.scope : a
    const scpB = Item.#isItem(b) ? b.scope : b
    return scpA.length === scpB.length && scpA.join('|') === scpB.join('|')
  }

  /**
   * Creates a new instance of Item with the provided arguments.
   * If the first argument is an instance of Item, returns a clone of that item.
   * If the first argument is a string, creates a new Item instance with the provided arguments.
   * @param args The arguments to use when creating the new Item instance.
   * @returns A new instance of Item.
   * @throws An error if the provided arguments are invalid.
   */
  static new(...args: ConstructorParameters<typeof Item> | Item[]) {
    if (args[0] instanceof Item) return Item.#clone(args[0])
    if (typeof args[0] === 'string')
      return new Item(...(args as ConstructorParameters<typeof Item>))
    throw new Error(`invalid item: ${JSON.stringify(args)}`)
  }

  /**
   * Creates a new item that is a clone of this item.
   * @returns A new item that is a clone of this item.
   */
  clone() {
    return Item.#clone(this)
  }

  /**
   * Determines whether this item is of the specified type and, optionally, has the specified value.
   * @param type The type of item to check for.
   * @param value Optional. The value to check for.
   * @returns True if this item is of the specified type and, optionally, has the specified value; false otherwise.
   */
  is(type: (typeof listType)[number], value?: string) {
    return Item.#is(this, type, value)
  }

  /**
   * Determines whether this item's scope is equal to the scope of the specified item or scope array.
   * @param item The item or scope array to compare against.
   * @returns True if the scopes are equal, false otherwise.
   */
  isScopeEqual(item: Item | Scope[]) {
    return Item.#isScopeEqual(this, item)
  }

  /**
   * Returns the scope at the specified index in this item's scope array.
   * @param n The index of the scope to retrieve.
   * @returns The scope at the specified index.
   */
  scopeAt(n: number) {
    return at(this.scope, n)
  }
}

// export
export default Item
export type { Scope }
