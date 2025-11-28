const listForbidden = ['Class', 'Function', 'Native']

const main = (setClass: Set<string>) => {
  setClass.forEach((item) => {
    if (!listForbidden.includes(item)) return
    throw new Error(
      `Coffee-AHK/forbidden: class name '${item}' is reserved or forbidden. See forbidden list.`,
    )
  })
}

export default main
