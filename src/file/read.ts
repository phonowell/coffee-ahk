import { createTranspileError, ErrorType } from '../utils/error.js'

import include, { type FileMappingRef } from './include.js'

const main = async (
  source: string,
  salt: string,
  mappingRef?: FileMappingRef,
): Promise<string> => {
  let src = source

  const extname = '.coffee'
  if (!src.endsWith(extname)) src += extname

  const content = await include(src, salt, mappingRef)
  if (!content) {
    throw createTranspileError(
      ErrorType.FILE_ERROR,
      `include failed - source file not found or empty: '${src}'`,
      `Check file path and ensure file has content`,
    )
  }

  return content.replace(/\r/g, '')
}

export default main
