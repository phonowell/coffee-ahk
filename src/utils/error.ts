import type { Context } from '../types'

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
 * Automatically formats error messages with line numbers.
 */
export class TranspileError extends Error {
  readonly type: ErrorType

  constructor(
    ctx: Pick<Context, 'token'>,
    type: ErrorType,
    message: string,
    readonly solution?: string,
  ) {
    const locationData = ctx.token[2]
    const line = locationData.first_line + 1
    const column =
      'first_column' in locationData &&
      typeof locationData.first_column === 'number'
        ? locationData.first_column + 1
        : 1

    let fullMessage = `Coffee-AHK/${type} (line ${line}, column ${column}): ${message}`
    if (solution) fullMessage += `\nSolution: ${solution}`

    super(fullMessage)
    this.name = 'TranspileError'
    this.type = type
  }
}

/** Create a TranspileError without Context (for file-level or batch validation errors). */
export const createTranspileError = (
  type: ErrorType,
  message: string,
  solution?: string,
): Error => {
  let fullMessage = `Coffee-AHK/${type}: ${message}`
  if (solution) fullMessage += `\nSolution: ${solution}`
  return new Error(fullMessage)
}
