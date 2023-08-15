// function

const main = <T>(list: T[], index: number) => {
  const i = index < 0 ? list.length + index : index
  if (i < 0 || i >= list.length) return undefined
  return list[i]
}

// export
export default main
