import { createTranspileError } from '../utils/error.js'

import include from './include.js'

const main = async (source: string, salt: string): Promise<string> => {
  let src = source

  const extname = '.coffee'
  if (!src.endsWith(extname)) src += extname

  const content = await include(src, salt)
  if (!content) {
    throw createTranspileError(
      'file',
      `include failed, source file not found or empty: '${src}'`,
    )
  }

  return content.replace(/\r/g, '')
}

export default main
