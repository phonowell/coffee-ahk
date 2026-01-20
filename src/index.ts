import { glob } from 'fire-keeper'

import { version } from '../package.json'

import start from './entry/index.js'
import { processContent, read, write } from './file/index.js'
import log from './logger/index.js'
import { createTranspileError, ErrorType } from './utils/error.js'

import type { Options, PartialOptions } from './types/options.js'

export type { Options, PartialOptions }

type FileMappingEntry = { file: string; line: number; content: string }
type FileMappingRef = { mapping?: FileMappingEntry[] }

const DEFAULT_OPTIONS: Options = {
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

/** Show source context around error line with original file info */
const showSourceContext = (
  source: string,
  lineNum: number,
  mapping?: FileMappingEntry[],
) => {
  if (!mapping) {
    // Fallback: no import/include, show merged content
    const lines = source.split('\n')
    const start = Math.max(0, lineNum - 3)
    const end = Math.min(lines.length, lineNum + 2)
    console.log('\n📍 Source context:')
    for (let i = start; i < end; i++) {
      const marker = i === lineNum - 1 ? '→' : ' '
      console.log(`  ${marker} ${i + 1} | ${lines[i]}`)
    }
    return
  }

  const errorEntry = mapping[lineNum - 1]
  if (!errorEntry) return

  const { file, line } = errorEntry
  const fileEntries = mapping.filter((e) => e.file === file)
  const start = Math.max(0, line - 3)
  const end = Math.min(fileEntries.length, line + 2)

  console.log(`\n📍 ${file}:${line}`)
  for (let i = start; i < end; i++) {
    const entry = fileEntries[i]
    if (!entry) continue
    const marker = i === line - 1 ? '→' : ' '
    console.log(`  ${marker} ${i + 1} | ${entry.content}`)
  }
}

/** Re-throw error with source context if line number available */
const rethrowWithContext = (
  e: unknown,
  source: string,
  mapping?: FileMappingEntry[],
): never => {
  const error = e as Error
  const lineNum = extractLineNumber(error.message)
  if (lineNum) showSourceContext(source, lineNum, mapping)
  throw e
}

/** Main transpilation function with top-level error handling */
const transpile = (source: string, options: PartialOptions = {}) => {
  const mergedOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
  }

  // salt
  if (!mergedOptions.salt) mergedOptions.salt = generateSalt()

  if (mergedOptions.string) return transpileAsText(source, mergedOptions)
  return transpileAsFile(source, mergedOptions)
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
  if (!source2) {
    throw createTranspileError(
      ErrorType.FILE_ERROR,
      `invalid source '${source}'`,
      `Ensure file exists with .coffee extension`,
    )
  }

  const mappingRef: FileMappingRef = {}
  const content = await read(source2, options.salt, mappingRef)

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

    // 处理超长行（逗号换行）并验证行长限制
    const processed = processContent(result.content)

    if (options.save)
      await write(source2, { ...result, content: processed }, options)

    return processed
  } catch (e) {
    return rethrowWithContext(e, content, mappingRef.mapping)
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

    // 处理超长行（逗号换行）并验证行长限制
    return processContent(result.content)
  } catch (e) {
    return rethrowWithContext(e, content)
  }
}

export default transpile
export { version }
