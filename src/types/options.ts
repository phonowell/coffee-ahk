/**
 * Transpilation options type definitions.
 * Extracted to avoid circular dependencies.
 */

export type Options = {
  /** Generate AST output */
  ast: boolean
  /** Show CoffeeScript AST */
  coffeeAst: boolean
  /** Preserve comments in output */
  comments: boolean
  /** Include metadata in output */
  metadata: boolean
  /** Salt for transpilation */
  salt: string
  /** Save output to file */
  save: boolean
  /** Return string instead of file */
  string: boolean
  /** Enable verbose logging */
  verbose: boolean
}

export type PartialOptions = Partial<Options>
