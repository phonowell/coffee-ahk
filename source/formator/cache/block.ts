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
  'object'
] as const

// function

class CacheBlock {

  private cache: Item[] = []

  get last(): Item {
    return _.last(this.cache) || ''
  }

  clear(): void {
    this.cache = []
  }

  pop(): Item {
    return this.cache.pop() || ''
  }

  push(
    name: Item
  ): void {
    if (!name) throw new Error('cacheBlock.push: name is empty')
    this.cache.push(name)
  }
}

// export
export default new CacheBlock()