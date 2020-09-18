import _ from 'lodash'

// interface

type Type = typeof listType[number]

type Value = string

type Item = {
  comment?: string[]
  type: Type
  value: Value
}

// variable

const itemEmpty: Item = {
  type: 'error',
  value: ''
}

const listType = [
  '++',
  ',',
  '--',
  '.',
  ':',
  '=',
  'boolean',
  'bracket',
  'break',
  'class',
  'compare',
  'continue',
  'edge',
  'error',
  'for',
  'for-in',
  'function',
  'identifier',
  'if',
  'logical-operator',
  'math',
  'negative',
  'new',
  'new-line',
  'number',
  'origin',
  'property',
  'prototype',
  'return',
  'string',
  'this',
  'while'
] as const

// function

class Content {

  private list: Item[] = []

  get last(): Item {
    return this.eq(-1)
  }

  get length(): number {
    return this.list.length
  }

  clear(): void {
    this.list = []
  }

  clone(): Content['list'] {
    return [...this.list]
  }

  eq(
    n: number
  ): Item {
    return n >= 0
      ? this.list[n]
      : this.list[this.length + n]
  }

  pop(): Item {
    return this.list.pop() || itemEmpty
  }

  push(type: Type): this
  push(type: Type, value: Value | number): this
  push(
    type: Type,
    value?: Value | number
  ): this {

    if (typeof value !== 'undefined')
      this.list.push({
        type,
        value: value.toString()
      })
    else
      this.list.push({
        type,
        value: type
      })
    return this
  }

  shift(): Item {
    return this.list.shift() || itemEmpty
  }

  unshift(type: Type): this
  unshift(type: Type, value: Value | number): this
  unshift(
    type: Type,
    value?: Value | number
  ): this {

    if (typeof value !== 'undefined')
      this.list.unshift({
        type,
        value: value.toString()
      })
    else
      this.list.unshift({
        type,
        value: type
      })
    return this
  }
}

// export
export default new Content()