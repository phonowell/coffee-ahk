import { glob } from 'fire-keeper'

import start from './entry/index.js'
import { read, write } from './file/index.js'
import log from './logger/index.js'

type Options = typeof DEFAULT_OPTIONS
export type PartialOptions = Partial<Options>

const DEFAULT_OPTIONS = {
  /** Include anonymous functions */
  anonymous: true,
  /** Generate AST output */
  ast: false,
  /** Use built-in functions */
  builtins: true,
  /** Show CoffeeScript AST */
  coffeeAst: false,
  /** Preserve comments in output */
  comments: false,
  /** Include metadata in output */
  metadata: true,
  /** Salt for transpilation */
  salt: '',
  /** Save output to file */
  save: true,
  /** Return string instead of file */
  string: false,
  /** Track function calls */
  track: false,
  /** Enable verbose logging */
  verbose: false,
}

const generateSalt = (): string =>
  Math.random().toString(32).split('.')[1].padStart(11, '0')

const main = (source: string, option: PartialOptions = {}) => {
  const option2 = {
    ...DEFAULT_OPTIONS,
    ...option,
  }

  // salt
  if (!option2.salt) option2.salt = generateSalt()

  if (option2.string) return transpileAsText(source, option2)
  return transpileAsFile(source, option2)
}

const transpileAsFile = async (
  source: string,
  options: Options,
): Promise<string> => {
  const listSource = source.endsWith('.coffee')
    ? [source]
    : [source, `${source}.coffee`, `${source}/index.coffee`]

  const [source2] = (await glob(listSource)).filter((item) =>
    item.endsWith('.coffee'),
  )
  if (!source2) throw new Error(`invalid source '${source}'`)

  const content = await read(source2, options.salt)

  const result = start(content, options)

  if (options.verbose) {
    if (options.coffeeAst) console.log(result.raw)
    log(result.ast)
  }

  if (options.save) await write(source2, result, options)

  return result.content
}

const transpileAsText = (content: string, options: Options): string => {
  const result = start(content, options)

  if (options.verbose) {
    if (options.coffeeAst) console.log(result.raw)
    log(result.ast)
  }

  return result.content
}

export default main
