import cache from './cache'

// interface

import { Item as Scope } from './cache'

type Type = typeof listType[number]
type Value = string

type Item = {
  comment?: string[]
  scope: Scope[]
  type: Type
  value: Value
}

// variable

const itemEmpty: Item = {
  scope: [],
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
  'class',
  'compare',
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
  'new-line',
  'number',
  'origin',
  'property',
  'prototype',
  'statement',
  'string',
  'this',
  'while'
] as const

// function

class Content {

  private _list: Item[] = []

  get last(): Item {
    return this.eq(-1)
  }

  get length(): number {
    return this._list.length
  }

  get list(): Item[] {
    return [...this._list]
  }

  clear(): this {
    this._list = []
    return this
  }

  eq(
    n: number
  ): Item {
    return n >= 0
      ? this._list[n]
      : this._list[this.length + n]
  }

  load(list: Item[]): this {
    this._list = list
    return this
  }

  pop(): Item {
    return this._list.pop() || itemEmpty
  }

  push(type: Type): this
  push(type: Type, value: Value | number): this
  push(
    type: Type,
    value?: Value | number
  ): this {

    if (typeof value !== 'undefined')
      this._list.push({
        type,
        value: value.toString(),
        scope: cache.list
      })
    else
      this._list.push({
        type,
        value: type,
        scope: cache.list
      })
    return this
  }

  shift(): Item {
    return this._list.shift() || itemEmpty
  }

  unshift(type: Type): this
  unshift(type: Type, value: Value | number): this
  unshift(
    type: Type,
    value?: Value | number
  ): this {

    if (typeof value !== 'undefined')
      this._list.unshift({
        type,
        value: value.toString(),
        scope: cache.list
      })
    else
      this._list.unshift({
        type,
        value: type,
        scope: cache.list
      })
    return this
  }
}

// export
export default new Content()