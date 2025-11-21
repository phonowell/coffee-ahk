import { glob } from 'fire-keeper'

import { version } from '../package.json'

import start from './entry/index.js'
import { read, write } from './file/index.js'
import log from './logger/index.js'

type Options = typeof DEFAULT_OPTIONS
export type PartialOptions = Partial<Options>

const DEFAULT_OPTIONS = {
  /** Generate AST output */
  ast: false,
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
  /** Enable verbose logging */
  verbose: false,
}

/** Generate random salt for transpilation */
const generateSalt = (): string =>
  Math.random().toString(32).split('.')[1]?.padStart(11, '0') ?? ''

/** Output warnings to console */
const printWarnings = (warnings: string[]) => {
  if (warnings.length === 0) return
  console.log(`⚠️ Warnings (${warnings.length}):`)
  warnings.forEach((w) => console.log(`  - ${w}`))
}

/** Extract line number from error message */
const extractLineNumber = (message: string): number | null => {
  const match = message.match(/line (\d+)/i)
  return match?.[1] ? parseInt(match[1], 10) : null
}

/** Show source context around error line */
const showSourceContext = (source: string, lineNum: number) => {
  const lines = source.split('\n')
  const start = Math.max(0, lineNum - 3)
  const end = Math.min(lines.length, lineNum + 2)
  console.log('\n📍 Source context:')
  for (let i = start; i < end; i++) {
    const marker = i === lineNum - 1 ? '→' : ' '
    console.log(`  ${marker} ${i + 1} | ${lines[i]}`)
  }
}

/** Re-throw error with source context if line number available */
const rethrowWithContext = (e: unknown, source: string): never => {
  const error = e as Error
  const lineNum = extractLineNumber(error.message)
  if (lineNum) showSourceContext(source, lineNum)
  throw e
}

/** Main transpilation function with top-level error handling */
const transpile = async (source: string, options: PartialOptions = {}) => {
  try {
    const mergedOptions = {
      ...DEFAULT_OPTIONS,
      ...options,
    }

    // salt
    if (!mergedOptions.salt) mergedOptions.salt = generateSalt()

    if (mergedOptions.string)
      return await transpileAsText(source, mergedOptions)
    return await transpileAsFile(source, mergedOptions)
  } catch (e) {
    const error = e as Error

    const divider = '-'.repeat(error.message.length + 4)

    console.log(
      [divider, error.message, divider, error.stack, divider].join('\n'),
    )

    return undefined
  }
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
  if (!source2) throw new Error(`ahk/file: invalid source '${source}'`)

  const content = await read(source2, options.salt)

  try {
    const startTime = Date.now()
    const result = await start(content, options)
    const elapsed = Date.now() - startTime

    if (options.verbose) {
      if (options.coffeeAst) console.log(result.raw)
      log(result.ast)
      console.log(`⏱️ Compiled in ${elapsed}ms`)
    }

    printWarnings(result.warnings)

    if (options.save) await write(source2, result, options)

    return result.content
  } catch (e) {
    return rethrowWithContext(e, content)
  }
}

const transpileAsText = async (
  content: string,
  options: Options,
): Promise<string> => {
  try {
    const startTime = Date.now()
    const result = await start(content, options)
    const elapsed = Date.now() - startTime

    if (options.verbose) {
      if (options.coffeeAst) console.log(result.raw)
      log(result.ast)
      console.log(`⏱️ Compiled in ${elapsed}ms`)
    }

    printWarnings(result.warnings)

    return result.content
  } catch (e) {
    return rethrowWithContext(e, content)
  }
}

export default transpile
export { version }
