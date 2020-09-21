import _ from 'lodash'

// interface

import { Item as Scope } from './cache'
import { Context } from '../type'

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

  clone(): Item[] {
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

  push(ctx: Context, type: Type): this
  push(ctx: Context, type: Type, value: Value | number): this
  push(
    ctx: Context,
    type: Type,
    value?: Value | number
  ): this {

    if (typeof value !== 'undefined')
      this.list.push({
        type,
        value: value.toString(),
        scope: ctx.cache.clone()
      })
    else
      this.list.push({
        type,
        value: type,
        scope: ctx.cache.clone()
      })
    return this
  }

  shift(): Item {
    return this.list.shift() || itemEmpty
  }

  unshift(ctx: Context, type: Type): this
  unshift(ctx: Context, type: Type, value: Value | number): this
  unshift(
    ctx: Context,
    type: Type,
    value?: Value | number
  ): this {

    if (typeof value !== 'undefined')
      this.list.unshift({
        type,
        value: value.toString(),
        scope: ctx.cache.clone()
      })
    else
      this.list.unshift({
        type,
        value: type,
        scope: ctx.cache.clone()
      })
    return this
  }
}

// export
export default new Content()