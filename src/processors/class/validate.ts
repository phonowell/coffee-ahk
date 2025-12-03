import { listForbidden } from '../../utils/forbidden.js'

const isClassNameForbidden = (name: string): boolean =>
  listForbidden.includes(name.toLowerCase())

const main = (setClass: Set<string>) => {
  setClass.forEach((item) => {
    if (!isClassNameForbidden(item)) return
    throw new Error(
      `Coffee-AHK/forbidden: class name '${item}' is reserved or forbidden (name is in forbidden list).`,
    )
  })
}

export default main
