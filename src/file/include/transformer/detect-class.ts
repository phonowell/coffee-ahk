/**
 * Class detection and validation logic.
 */

import { createFileError } from '../../../utils/error.js'

/**
 * Check if code contains class declarations.
 */
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
    throw createFileError(
      'file',
      `module contains both class and export: '${file}'`,
    )
  }
}
