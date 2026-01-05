import { ErrorType, TranspileError } from '../../utils/error.js'
import { listForbidden } from '../../utils/forbidden.js'

import type { Context } from '../../types'

const isClassNameForbidden = (name: string): boolean =>
  listForbidden.includes(name.toLowerCase())

const main = (setClass: Set<string>, ctx: Context) => {
  setClass.forEach((item) => {
    if (!isClassNameForbidden(item)) return

    throw new TranspileError(
      ctx,
      ErrorType.FORBIDDEN,
      `class name '${item}' is reserved or forbidden`,
      `Choose a different class name not in the forbidden list`,
    )
  })
}

export default main
