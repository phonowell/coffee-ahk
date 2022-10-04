// variable

const listForbidden = ['exception', 'off', 'on', 'toggle']

// function

const main = (setFn: Set<string>) => {
  setFn.forEach(item => {
    if (!listForbidden.includes(item.toLowerCase())) return
    throw new Error(`ahk/forbidden: function name '${item}' is not allowed`)
  })
}

// export
export default main
