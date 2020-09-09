import _ from 'lodash'

// interface

type Item = 'else' | 'function' | 'if'

// function

class CacheBlock {

  private cache: Item[] = []

  private rule = [
    'else',
    'function',
    'if'
  ] as const

  get last(): Item | undefined {
    return _.last(this.cache)
  }

  clear(): void {
    this.cache = []
  }

  pop(): Item | undefined {
    return this.cache.pop()
  }

  push(
    name: Item
  ): void {
    this.cache.push(name)
  }

  validate(
    name: string | undefined
  ): boolean {
    
    if (!name) return false
    return this.rule.includes(name as Item)
  }
}

// export
export default new CacheBlock()