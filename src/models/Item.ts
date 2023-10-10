import Scope from './Scope'

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

// class

/**
 * An item of the AST.
 */
class Item {
  /**
   * The comment associated with the item.
   * @type {string[] | undefined}
   */
  comment?: string[]

  /**
   * The scope of the item.
   * @type {Scope}
   */
  scope: Scope

  /**
   * The type of the item.
   * @type {string}
   */
  type: (typeof listType)[number]

  /**
   * The value of the item.
   * @type {string}
   */
  value: string

  /**
   * Creates a new item.
   * @param {string} [type] - The type of the item.
   * @param {string} [value] - The value of the item.
   * @param {Scope} [scope] - The scope of the item.
   */
  constructor(
    ...args:
      | [
          type?: Item['type'],
          value?: Item['value'],
          scope?: ConstructorParameters<typeof Scope>[0],
        ]
      | [Item]
  ) {
    if (args[0] instanceof Item) {
      const { scope, type, value } = args[0]
      this.type = type
      this.value = value
      this.scope = new Scope(scope)
      return
    }

    this.type = args[0] ?? 'void'
    this.value = (typeof args[1] === 'undefined' ? args[0] : args[1]) ?? ''
    this.scope = new Scope(args[2])
  }

  /**
   * Clones the item.
   * @returns {Item} A new item with the same properties as the original.
   */
  clone(): Item {
    const { scope, type, value } = this
    return new Item(type, value, scope)
  }

  /**
   * Checks if the item is of a certain type and value.
   * @param {string} type - The type to check.
   * @param {string} [value] - The value to check.
   * @returns {boolean} Whether the item is of the specified type and value.
   */
  is(type: (typeof listType)[number], value?: string): boolean {
    if (type !== this.type) return false
    if (typeof value === 'undefined') return true
    return value === this.value
  }
}

// export
export default Item
