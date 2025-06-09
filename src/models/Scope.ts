import at from '../utils/at.js'

/**
 * KeyScope type
 */
type KeyScope = (typeof _listRule)[number]

/**
 * listRule array
 */
const _listRule = [
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

/**
 * Scope class
 */
class Scope {
  /**
   * @private
   * @property {KeyScope[]} #list - The list of KeyScope
   */
  #list: KeyScope[] = []

  /**
   * @public
   * @property {KeyScope} next - The next KeyScope
   */
  next: KeyScope = ''

  /**
   * @constructor
   * @param {...(Scope | KeyScope[])} args - The list of Scope or KeyScope
   */
  constructor(...args: Parameters<Scope['reload']>) {
    this.reload(...args)
  }

  /**
   * @public
   * @property {string} last - The last KeyScope
   */
  get last() {
    return this.at(-1) ?? ''
  }

  /**
   * @public
   * @property {number} length - The length of the list
   */
  get length() {
    return this.#list.length
  }

  /**
   * @public
   * @property {KeyScope[]} list - The list of KeyScope
   */
  get list() {
    return [...this.#list]
  }

  /**
   * @public
   * @function at
   * @param {number} n - The index of the KeyScope
   * @returns {KeyScope | undefined} The KeyScope at the index
   */
  at(n: number): KeyScope | undefined {
    return at(this.#list, n)
  }

  /**
   * @public
   * @function isEquals
   * @param {(Scope | KeyScope[] | string[])} target - The target to compare
   * @returns {boolean} Whether the target is equal to the list
   */
  isEquals(target: Scope | KeyScope[] | string[]): boolean {
    const list = target instanceof Scope ? target.list : target
    return (
      this.#list.length === list.length &&
      this.#list.every((item, i) => item === list[i])
    )
  }

  /**
   * @public
   * @function pop
   * @returns {KeyScope} The last KeyScope
   */
  pop(): KeyScope {
    return this.#list.pop() ?? ''
  }

  /**
   * @public
   * @function push
   * @param {...KeyScope} args - The list of KeyScope to push
   * @returns {number} The new length of the list
   */
  push(...args: KeyScope[]): number {
    return this.#list.push(...args)
  }

  /**
   * @public
   * @function reload
   * @param {(Scope | KeyScope[])} [input=[]] - The input to reload
   */
  reload(input: Scope | KeyScope[] = []) {
    this.#list = input instanceof Scope ? input.list : input
  }

  /**
   * @public
   * @function shift
   * @returns {KeyScope} The first KeyScope
   */
  shift(): KeyScope {
    return this.#list.shift() ?? ''
  }

  /**
   * @public
   * @function slice
   * @param {...Parameters<string[]['slice']>} args - The arguments to slice
   * @returns {KeyScope[]} The sliced list
   */
  slice(...args: Parameters<string[]['slice']>): KeyScope[] {
    return this.#list.slice(...args)
  }

  /**
   * @public
   * @function unshift
   * @param {...KeyScope} args - The list of KeyScope to unshift
   * @returns {number} The new length of the list
   */
  unshift(...args: KeyScope[]): number {
    return this.#list.unshift(...args)
  }
}

export default Scope
