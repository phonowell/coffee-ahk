// interface

type Type = typeof listType[number]

type Item = {
  type: Type
  value: string
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
    value: string
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
  push(type: Type, value: string): this
  push(
    type: Type,
    value?: string
  ): this {

    if (value)
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
      .map(it => it.value)
      .join('')
  }
}

// export
export default new Content()