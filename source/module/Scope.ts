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
  #list: Item[] = []
  next: Item = ''

  get last(): Item {
    return this.eq(-1)
  }

  get length(): number {
    return this.#list.length
  }

  get list(): Item[] {
    return [...this.#list]
  }

  clear(): void {
    this.#list = []
  }

  clone(): Item[] {
    return [...this.#list]
  }

  eq(n: number): Item {
    return n >= 0 ? this.#list[n] : this.#list[this.length + n]
  }

  pop(): Item {
    return this.#list.pop() || ''
  }

  push(name: Item): void {
    if (!name) throw new Error('scope.push: name is empty')
    this.#list.push(name)
  }
}

// export
export default new Scope()
