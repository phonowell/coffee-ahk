/** Class detection and validation logic. */

import { ErrorType, TranspileError } from '../../../utils/error.js'

import type { Context } from '../../../types/index.js'

/** Create minimal Context for class/export conflict errors */
const createFileContext = (): Pick<Context, 'token'> => ({
  token: ['', '', { first_line: 0, last_line: 0 }] as Context['token'],
})

/** Check if code contains class declarations. */
export const hasClassDeclaration = (code: string): boolean =>
  /^\s*class\s+\w+/m.test(code)

/**
 * Validate that class and export don't coexist in the same module.
 * Throws error if both are present.
 */
export const validateClassExportConflict = (
  file: string,
  hasClass: boolean,
  hasExport: boolean,
): void => {
  if (hasClass && hasExport) {
    throw new TranspileError(
      createFileContext() as Context,
      ErrorType.FILE_ERROR,
      `module contains both class and export: '${file}'`,
      `Separate class definitions and exports into different modules`,
    )
  }
}
