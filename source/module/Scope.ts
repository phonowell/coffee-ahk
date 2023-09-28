// interface

export type TScope = (typeof listRule)[number]

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
  #list: TScope[] = []
  next: TScope = ''

  get last(): TScope {
    return this.eq(-1)
  }

  get length(): number {
    return this.#list.length
  }

  get list(): TScope[] {
    return [...this.#list]
  }

  clear() {
    this.#list = []
  }

  clone(): TScope[] {
    return [...this.#list]
  }

  eq(n: number): TScope {
    return n >= 0 ? this.#list[n] : this.#list[this.length + n]
  }

  pop(): TScope {
    return this.#list.pop() ?? ''
  }

  push(name: TScope) {
    if (!name) throw new Error('scope.push: name is empty')
    this.#list.push(name)
  }
}

// export
const scope = new Scope()
export default scope
