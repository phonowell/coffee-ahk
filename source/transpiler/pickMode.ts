// function

function main(
  listMain: string[]
): string[] {

  const line = listMain[0]

  if (!line.startsWith('# use')) return []

  return line
    .replace(`# use`, '')
    .trim()
    .split('/')
}

// export
export default main