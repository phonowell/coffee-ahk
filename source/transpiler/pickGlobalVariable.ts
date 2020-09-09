import { getDepth } from './fn'

// function

function main(
  listMain: string[]
): {
  main: string[]
  var: string[]
} {

  const listContent: string[] = []
  const listVariable: string[] = []

  for (const line of listMain) {
    const [key, value] = pickData(line)

    if (!(key && value)) {
      listContent.push(line)
      continue
    }

    if (value.includes('[')) {
      value
        .replace(/[\[\]]/g, '')
        .split(',')
        .map(it => it.trim())
        .forEach((it, i) => listContent.push(`${key}[${i}] = ${it}`))
      listVariable.push(`${key} = []`)
      continue
    }

    listVariable.push(`${key} = ${value}`)
  }

  return {
    main: listContent,
    var: listVariable
  }
}

function pickData(
  line: string
): [string, string] {

  const resultFail: [string, string] = ['', '']

  if (getDepth(line)) return resultFail
  if (!line.includes('=')) return resultFail
  if (line.includes('->')) return resultFail

  const [key, value] = line
    .split('=')
    .map(it => it.trim())
  if (key.search(/[\s\{\}\(\)\[\]\.,'"]/) !== -1) return resultFail

  return [key, value]
}

// export
export default main