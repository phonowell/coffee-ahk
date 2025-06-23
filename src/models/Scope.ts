import { at } from 'fire-keeper'

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
    return at(this.#list, n)
  }

  /** Check if target is equal to the current scope list */
  isEqual(target: Scope | ScopeType[]): boolean {
    const list = target instanceof Scope ? target.list : target
    return (
      this.#list.length === list.length &&
      this.#list.every((item, i) => item === list[i])
    )
  }

  pop(): ScopeType {
    return this.#list.pop() ?? ''
  }

  push(...args: ScopeType[]): number {
    return this.#list.push(...args)
  }

  /** Reload the scope list with new input */
  reload(input: Scope | ScopeType[] = []) {
    this.#list = input instanceof Scope ? input.list : input
  }

  shift(): ScopeType {
    return this.#list.shift() ?? ''
  }

  slice(...args: Parameters<string[]['slice']>): ScopeType[] {
    return this.#list.slice(...args)
  }

  unshift(...args: ScopeType[]): number {
    return this.#list.unshift(...args)
  }
}

export default Scope
