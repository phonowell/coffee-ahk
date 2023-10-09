import at from '../utils/at'

// interface

export type KeyScope = (typeof listRule)[number]

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

  /**
   * Creates a new Scope instance.
   * @param list A list of key scopes to initialize the Scope with.
   */
  constructor(...args: Parameters<Scope['reload']>) {
    this.reload(...args)
  }

  /**
   * Returns the last item in the Scope's list, or an empty string if the list is empty.
   * @returns The last item in the Scope's list, or an empty string if the list is empty.
   */
  get last() {
    return this.at(-1) ?? ''
  }

  /**
   * Returns the number of items in the Scope's list.
   * @returns The number of items in the Scope's list.
   */
  get length() {
    return this.#list.length
  }

  /**
   * Returns a clone of the Scope's list.
   * @returns A clone of the Scope's list.
   */
  get list() {
    return [...this.#list]
  }

  /**
   * Returns the item at the specified index in the Scope's list.
   * @param n The index of the item to retrieve.
   * @returns The item at the specified index in the Scope's list.
   * @throws An error if the specified index is out of bounds.
   */
  at(n: number) {
    return at(this.#list, n)
  }

  /**
   * Clears the Scope's list of all items.
   * @returns The Scope instance with an empty list.
   */
  clear() {
    this.#list = []
  }

  isEquals(target: Scope | KeyScope[] | string[]) {
    const list = target instanceof Scope ? target.list : target
    return (
      this.#list.length === list.length &&
      this.#list.every((item, i) => item === list[i])
    )
  }

  /**
   * Removes and returns the last item in the Scope's list.
   * If the list is empty, returns an empty string.
   * @returns The last item in the Scope's list, or an empty string if the list is empty.
   */
  pop() {
    return this.#list.pop() ?? ''
  }

  /**
   * Adds the provided name to the end of the Scope's list.
   * @param name The name to add to the Scope's list.
   * @throws An error if the provided name is empty.
   */
  push(name: KeyScope) {
    if (!name) throw new Error('scope.push: name is empty')
    this.#list.push(name)
  }

  reload(input: Scope | KeyScope[] = []) {
    this.#list = input instanceof Scope ? input.list : input
  }

  shift() {
    return this.#list.shift() ?? ''
  }

  unshift(...args: KeyScope[]) {
    this.#list.unshift(...args)
  }
}

// export
export default Scope
