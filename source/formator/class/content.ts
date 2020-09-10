import _ from 'lodash'

// interface

type Type = typeof listType[number]

type Value = string | number

type Item = {
  type: Type
  value: Value
}

// variable

const itemEmpty: Item = {
  type: 'error',
  value: ''
}

const listType = [
  '(',
  ')',
  '+',
  '++',
  ',',
  '-',
  '--',
  '.',
  ':',
  '=',
  '[',
  ']',
  'break',
  'call-end',
  'call-start',
  'comment',
  'compare',
  'continue',
  'else',
  'error',
  'function',
  'identifier',
  'if',
  'index-end',
  'index-start',
  'interpolation-end',
  'interpolation-start',
  'new-line',
  'number',
  'param-end',
  'param-start',
  'property',
  'prototype',
  'return',
  'string',
  'this',
  'while',
  '{',
  '}'
] as const

// function

class Content {

  private list: {
    type: Type,
    value: Value
  }[] = []

  get last(): Item {
    return this.eq(-1)
  }

  get length(): number {
    return this.list.length
  }

  clear(): void {
    this.list = []
  }

  eq(
    n: number
  ): Item {
    return n >= 0
      ? this.list[n]
      : this.list[this.list.length + n]
  }

  pop(): Item {
    return this.list.pop() || itemEmpty
  }

  push(type: Type): this
  push(type: Type, value: Value): this
  push(
    type: Type,
    value?: Value
  ): this {

    if (typeof value !== 'undefined')
      this.list.push({ type, value })
    else
      this.list.push({
        type,
        value: type
      })
    return this
  }

  render(): string {
    return this.list
      .map(it =>
        it.type === 'new-line'
          ? '\n' + _.repeat(' ', (it.value as number) * 2)
          : it.value
      )
      .join('')
  }

  shift(): Item {
    return this.list.shift() || itemEmpty
  }

  unshift(type: Type): this
  unshift(type: Type, value: Value): this
  unshift(
    type: Type,
    value?: Value
  ): this {

    if (typeof value !== 'undefined')
      this.list.unshift({ type, value })
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