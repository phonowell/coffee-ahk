const listForbidden = ['Class', 'Function', 'Native']

const main = (setClass: Set<string>) => {
  setClass.forEach((item) => {
    if (!listForbidden.includes(item)) return
    throw new Error(`ahk/forbidden: class name '${item}' is not allowed`)
  })
}

export default main
