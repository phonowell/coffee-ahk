// interface

export type Item = typeof listRule[number]

// variable

const listRule = [
  '',
  'array',
  'call',
  'case',
  'catch',
  'class',
  'else',
  'finally',
  'for',
  'function',
  'if',
  'object',
  'parameter',
  'switch',
  'try',
  'while',
] as const

// function

class Scope {

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

  clone(): Item[] {
    return [...this._list]
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

    if (!name) throw new Error('scope.push: name is empty')
    // if (this.next)
    //   throw new Error(`scope.push: clear scope.next '${this.next}' at first`)
    this._list.push(name)
  }
}

// export
export default new Scope()