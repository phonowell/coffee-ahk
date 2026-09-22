import type { Context } from '../types/index.js'

export enum ErrorType {
  FORBIDDEN = 'forbidden',
  UNSUPPORTED = 'unsupported',
  CLOSURE_COLLISION = 'closure-collision',
  FILE_ERROR = 'file-error',
  SYNTAX_ERROR = 'syntax-error',
  CLASS_ERROR = 'class-error',
  VALIDATION_ERROR = 'validation-error',
}

/**
 * Unified error class for Coffee-AHK transpilation errors.
 * Carries line/column as structured fields for source-context display.
 */
export class TranspileError extends Error {
  readonly type: ErrorType
  readonly line: number
  readonly column: number

  constructor(
    ctx: Pick<Context, 'token'>,
    type: ErrorType,
    message: string,
    readonly solution?: string,
  ) {
    const locationData = ctx.token[2]
    const line = locationData.first_line + 1
    const column =
      'first_column' in locationData && typeof locationData.first_column === 'number'
        ? locationData.first_column + 1
        : 1

    let fullMessage = `Coffee-AHK/${type} (line ${line}, column ${column}): ${message}`
    if (solution) fullMessage += `\nSolution: ${solution}`

    super(fullMessage)
    this.name = 'TranspileError'
    this.type = type
    this.line = line
    this.column = column
  }
}

/**
 * Create a transpilation error without Context (file-level or batch errors).
 * `line`/`type` are attached as fields so callers can locate the source.
 */
export const createTranspileError = (
  type: ErrorType,
  message: string,
  solution?: string,
  line?: number,
): Error => {
  let fullMessage = `Coffee-AHK/${type}: ${message}`
  if (solution) fullMessage += `\nSolution: ${solution}`
  const error = new Error(fullMessage)
  error.name = 'TranspileError'
  return Object.assign(error, { type, line })
}
