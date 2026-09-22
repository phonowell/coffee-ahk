import { glob } from 'fire-keeper'

import start from './entry/index.js'
import { processContent, read, write } from './file/index.js'
import log from './logger/index.js'
import { createTranspileError, ErrorType } from './utils/error.js'

import type { FileMapping, FileMappingRef } from './file/include.js'
import type { Options, PartialOptions } from './types/options.js'

export type { Options, PartialOptions }

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

/**
 * Derive a deterministic salt from input via FNV-1a hash.
 * Same source always produces the same internal identifiers ({salt}_1, ℓm_{salt}_{id}),
 * so builds are reproducible; different sources get different salts,
 * preserving collision avoidance across separately compiled outputs.
 */
const hashSalt = (input: string): string => {
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  // 's' prefix guarantees a valid identifier start
  return `s${(h >>> 0).toString(36)}`
}

/** Output warnings to console */
const printWarnings = (warnings: string[]) => {
  if (warnings.length === 0) return
  console.log(`⚠️ Warnings (${warnings.length}):`)
  warnings.forEach((w) => console.log(`  - ${w}`))
}

/**
 * Resolve the 1-based line number for an error.
 * Prefers structured fields (TranspileError.line, CoffeeScript error.location)
 * and falls back to parsing "line N" from the message text.
 */
const getErrorLine = (e: unknown): number | null => {
  const err = e as {
    line?: number
    location?: { first_line?: number }
    message?: string
  }
  if (typeof err?.line === 'number') return err.line
  if (typeof err?.location?.first_line === 'number') return err.location.first_line + 1
  const match = /line (\d+)/i.exec(err?.message ?? '')
  return match?.[1] ? parseInt(match[1], 10) : null
}

/** Show source context around error line with original file info */
const showSourceContext = (source: string, lineNum: number, mapping?: FileMapping[]) => {
  if (!mapping) {
    // Fallback: no import/include, show merged content
    const lines = source.split('\n')
    const startLine = Math.max(0, lineNum - 3)
    const end = Math.min(lines.length, lineNum + 2)
    console.log('\n📍 Source context:')
    for (let i = startLine; i < end; i++) {
      const marker = i === lineNum - 1 ? '→' : ' '
      console.log(`  ${marker} ${i + 1} | ${lines[i]}`)
    }
    return
  }

  const errorEntry = mapping[lineNum - 1]
  if (!errorEntry) return

  const { file, line } = errorEntry
  const fileEntries = mapping.filter((e) => e.file === file)
  const startLine = Math.max(0, line - 3)
  const end = Math.min(fileEntries.length, line + 2)

  console.log(`\n📍 ${file}:${line}`)
  for (let i = startLine; i < end; i++) {
    const entry = fileEntries[i]
    if (!entry) continue
    const marker = i === line - 1 ? '→' : ' '
    console.log(`  ${marker} ${i + 1} | ${entry.content}`)
  }
}

/** Re-throw error with source context if line number available */
const rethrowWithContext = (e: unknown, source: string, mapping?: FileMapping[]): never => {
  const lineNum = getErrorLine(e)
  if (lineNum) showSourceContext(source, lineNum, mapping)
  throw e
}

/** Shared pipeline: transpile -> verbose report -> warnings -> line-length processing */
const compileContent = async (content: string, options: Options) => {
  const startTime = Date.now()
  const result = await start(content, options)

  if (options.verbose) {
    if (options.coffeeAst) console.log(result.raw)
    log(result.ast)
    console.log(`⏱️ Compiled in ${Date.now() - startTime}ms`)
  }

  printWarnings(result.warnings)

  return { ...result, content: processContent(result.content) }
}

/** Main transpilation function with top-level error handling */
const transpile = (source: string, options: PartialOptions = {}) => {
  const mergedOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
  }

  if (mergedOptions.string) return transpileAsText(source, mergedOptions)
  return transpileAsFile(source, mergedOptions)
}

const transpileAsFile = async (source: string, options: Options): Promise<string> => {
  const listSource = source.endsWith('.coffee')
    ? [source]
    : [source, `${source}.coffee`, `${source}/index.coffee`]

  const [source2] = (await glob(listSource)).filter((item) => item.endsWith('.coffee'))
  if (!source2) {
    throw createTranspileError(
      ErrorType.FILE_ERROR,
      `invalid source '${source}'`,
      `Ensure file exists with .coffee extension`,
    )
  }

  // Deterministic salt: identical output for the same entry file
  if (!options.salt) options.salt = hashSalt(source2)

  const mappingRef: FileMappingRef = {}
  const content = await read(source2, options.salt, mappingRef)

  try {
    const result = await compileContent(content, options)
    if (options.save) await write(source2, result, options)
    return result.content
  } catch (e) {
    return rethrowWithContext(e, content, mappingRef.mapping)
  }
}

const transpileAsText = async (content: string, options: Options): Promise<string> => {
  // Deterministic salt: identical output for the same source text
  if (!options.salt) options.salt = hashSalt(content)

  try {
    const result = await compileContent(content, options)
    return result.content
  } catch (e) {
    return rethrowWithContext(e, content)
  }
}

export { version } from './version.js'
export default transpile
