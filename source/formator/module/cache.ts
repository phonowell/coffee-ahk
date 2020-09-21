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

  private _list: Item[] = []
  next: Item = ''

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

  pop(): Item {
    return this._list.pop() || ''
  }

  push(
    name: Item
  ): void {

    if (!name) throw new Error('cache.push: name is empty')
    if (this.next)
      throw new Error(`cache.push: clear cache.next '${this.next}' at first`)
    this._list.push(name)
  }
}

// export
export default new Cache()