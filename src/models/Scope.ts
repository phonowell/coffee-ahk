import type { ScopeType } from './ScopeType.js'

/** Scope class */
class Scope {
  #list: ScopeType[] = []
  next: ScopeType = ''

  /** Constructor that accepts Scope or KeyScope arrays */
  constructor(...args: Parameters<Scope['reload']>) {
    this.reload(...args)
  }

  get first(): ScopeType {
    return this.at(0) ?? ''
  }

  get last(): ScopeType {
    return this.at(-1) ?? ''
  }

  get length(): number {
    return this.#list.length
  }

  get list(): ScopeType[] {
    return [...this.#list]
  }

  at(n: number): ScopeType | undefined {
    return this.#list.at(n)
  }

  /** Check if target is equal to the current scope list */
  isEqual(target: Scope | ScopeType[]): boolean {
    if (target instanceof Scope) {
      if (this.#list.length !== target.length) return false
      return this.#list.every((item, i) => item === target.at(i))
    }
    return (
      this.#list.length === target.length &&
      this.#list.every((item, i) => item === target[i])
    )
  }

  includes(value: ScopeType): boolean {
    return this.#list.includes(value)
  }

  pop(): ScopeType | undefined {
    return this.#list.pop()
  }

  push(...args: ScopeType[]): number {
    return this.#list.push(...args)
  }

  /** Reload the scope list with new input */
  reload(input: Scope | ScopeType[] = []) {
    this.#list = input instanceof Scope ? input.list : [...input]
  }

  shift(): ScopeType | undefined {
    return this.#list.shift()
  }

  slice(...args: Parameters<string[]['slice']>): ScopeType[] {
    return this.#list.slice(...args)
  }

  unshift(...args: ScopeType[]): number {
    return this.#list.unshift(...args)
  }
}

export default Scope
