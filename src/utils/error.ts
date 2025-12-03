import type { Context } from '../types'

/**
 * Unified error class for Coffee-AHK transpilation errors.
 * Automatically formats error messages with line numbers.
 */
export class TranspileError extends Error {
  constructor(ctx: Context, type: string, message: string) {
    const line = ctx.token[2].first_line + 1
    super(`Coffee-AHK/${type} (line ${line}): ${message}`)
    this.name = 'TranspileError'
  }
}

/** Create a TranspileError without Context (for file-level errors). */
export const createFileError = (type: string, message: string): Error =>
  new Error(`Coffee-AHK/${type}: ${message}`)
