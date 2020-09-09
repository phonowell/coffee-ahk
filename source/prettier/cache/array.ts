import _ from 'lodash'

// interface

type Item = string | number

// function

class CacheArray {

  private cache: Item[] = []

  get isEmpty(): boolean {
    return !this.cache.length
  }

  clear(): void {
    this.cache = []
  }

  last(): Item | undefined {
    return _.last(this.cache)
  }

  pop(): Item | undefined {
    return this.cache.pop()
  }

  push(
    item: Item
  ): void {
    this.cache.push(item)
  }
}

// export
export default new CacheArray()