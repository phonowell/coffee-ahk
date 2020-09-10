import _ from 'lodash'

// interface

type Item = typeof listRule[number]

// variable

const listRule = [
  '',
  'array',
  'else',
  'function',
  'if',
  'object',
  'while'
] as const

// function

class Cache {

  private list: Item[] = []

  get last(): Item {
    return _.last(this.list) || ''
  }

  clear(): void {
    this.list = []
  }

  pop(): Item {
    return this.list.pop() || ''
  }

  push(
    name: Item
  ): void {

    if (!name) throw new Error('cache.push: name is empty')
    this.list.push(name)
  }
}

// export
export default new Cache()