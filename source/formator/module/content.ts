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

  add(item: Item): this {
    const it = { ...item }
    it.scope = [...it.scope]
    this._list.push(it)
    return this
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

  equal(
    item: Item,
    type: string,
    value?: string
  ): boolean {
    if (typeof value === 'undefined')
      return item.type === type
    return item.type === type && item.value === value
  }

  load(
    list: Item[] = this.list
  ): this {

    const listResult: Item[] = []
    list.forEach(it => {
      if (it.type === 'void') return
      listResult.push(it)
    })
    this._list = listResult
    return this
  }

  new(item: Item): Item
  new(type: Item['type'], value: Item['value'], scope: Item['scope']): Item
  new(
    ...arg: [Item] | [Item['type']?, Item['value']?, Item['scope']?]
  ): Item {

    // clone
    if (
      arg.length === 1
      && arg[0]
      && typeof arg[0] === 'object'
    ) {
      const it = { ...arg[0] } as Item
      it.scope = [...it.scope]
      return it
    }

    // new
    return {
      type: arg[0] as Item['type'] || 'void',
      value: arg[1] || '',
      scope: arg[2] || []
    }
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