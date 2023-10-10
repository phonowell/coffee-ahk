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

// function

class Item {
  comment?: string[]
  scope: Scope
  type: (typeof listType)[number]
  value: string

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

  clone() {
    const { scope, type, value } = this
    return new Item(type, value, scope)
  }

  is(type: (typeof listType)[number], value?: string) {
    if (type !== this.type) return false
    if (typeof value === 'undefined') return true
    return value === this.value
  }
}

// export
export default Item
