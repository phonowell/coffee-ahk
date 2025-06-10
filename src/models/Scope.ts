import { at } from 'fire-keeper'

/** KeyScope type */
type KeyScope =
  | ''
  | 'array'
  | 'call'
  | 'case'
  | 'catch'
  | 'class'
  | 'else'
  | 'finally'
  | 'for'
  | 'function'
  | 'if'
  | 'object'
  | 'parameter'
  | 'switch'
  | 'try'
  | 'while'

/** Scope class */
class Scope {
  #list: KeyScope[] = []
  next: KeyScope = ''

  /** Constructor that accepts Scope or KeyScope arrays */
  constructor(...args: Parameters<Scope['reload']>) {
    this.reload(...args)
  }

  get first(): KeyScope {
    return this.at(0) ?? ''
  }

  get last(): KeyScope {
    return this.at(-1) ?? ''
  }

  get length(): number {
    return this.#list.length
  }

  get list(): KeyScope[] {
    return [...this.#list]
  }

  at(n: number): KeyScope | undefined {
    return at(this.#list, n)
  }

  /** Check if target is equal to the current scope list */
  isEqual(target: Scope | KeyScope[]): boolean {
    const list = target instanceof Scope ? target.list : target
    return (
      this.#list.length === list.length &&
      this.#list.every((item, i) => item === list[i])
    )
  }

  pop(): KeyScope {
    return this.#list.pop() ?? ''
  }

  push(...args: KeyScope[]): number {
    return this.#list.push(...args)
  }

  /** Reload the scope list with new input */
  reload(input: Scope | KeyScope[] = []) {
    this.#list = input instanceof Scope ? input.list : input
  }

  shift(): KeyScope {
    return this.#list.shift() ?? ''
  }

  slice(...args: Parameters<string[]['slice']>): KeyScope[] {
    return this.#list.slice(...args)
  }

  unshift(...args: KeyScope[]): number {
    return this.#list.unshift(...args)
  }
}

export default Scope
