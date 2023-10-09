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

  /**
   * Returns a new array containing clones of all items in the Scope's list.
   * @returns A new array containing clones of all items in the Scope's list.
   */
  clone() {
    return [...this.#list]
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
}

// export
const scope = new Scope()
export default scope
