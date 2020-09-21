import _ from 'lodash'

// interface

export type Item = typeof listRule[number]

// variable

const listRule = [
  '',
  'array',
  'class',
  'else',
  'for',
  'function',
  'if',
  'object',
  'while'
] as const

// function

class Cache {

  private list: Item[] = []
  next: Item = ''

  get last(): Item {
    return _.last(this.list) || ''
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
    return this.list.pop() || ''
  }

  push(
    name: Item
  ): void {

    if (!name) throw new Error('cache.push: name is empty')
    if (this.next)
      throw new Error(`cache.push: clear cache.next '${this.next}' at first`)
    this.list.push(name)
  }
}

// export
export default new Cache()