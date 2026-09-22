import { createTranspileError, ErrorType } from '../../utils/error.js'
import { listForbidden } from '../../utils/forbidden.js'

const isClassNameForbidden = (name: string): boolean => listForbidden.includes(name.toLowerCase())

const main = (setClass: Set<string>) => {
  setClass.forEach((item) => {
    if (!isClassNameForbidden(item)) return

    throw createTranspileError(
      ErrorType.FORBIDDEN,
      `class name '${item}' is reserved or forbidden`,
      `Choose a different class name not in the forbidden list`,
    )
  })
}

export default main
