import at from '../utils/at'

// interface

type KeyScope = (typeof listRule)[number]

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
  #list: KeyScope[] = []
  next: KeyScope = ''

  constructor(...args: Parameters<Scope['reload']>) {
    this.reload(...args)
  }

  get last() {
    return this.at(-1) ?? ''
  }

  get length() {
    return this.#list.length
  }

  get list() {
    return [...this.#list]
  }

  at(n: number) {
    return at(this.#list, n)
  }

  isEquals(target: Scope | KeyScope[] | string[]) {
    const list = target instanceof Scope ? target.list : target
    return (
      this.#list.length === list.length &&
      this.#list.every((item, i) => item === list[i])
    )
  }

  pop() {
    return this.#list.pop() ?? ''
  }

  push(...args: KeyScope[]) {
    return this.#list.push(...args)
  }

  reload(input: Scope | KeyScope[] = []) {
    this.#list = input instanceof Scope ? input.list : input
  }

  shift() {
    return this.#list.shift() ?? ''
  }

  slice(...args: Parameters<string[]['slice']>) {
    return this.#list.slice(...args)
  }

  unshift(...args: KeyScope[]) {
    return this.#list.unshift(...args)
  }
}

// export
export default Scope
