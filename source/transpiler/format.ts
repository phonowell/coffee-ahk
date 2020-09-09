import _ from 'lodash'
import { getDepth, setDepth } from './fn'

// function

function formatLine(
  line: string
): string {

  const depth = getDepth(line)

  // remove blank line
  line = line.trim()
  if (!line) return ''

  // remove comment
  if (line.startsWith('#')) return ''

  line = line

    // join space(s)
    .replace(/\s+/g, ' ')

    // replace ' to "
    .replace(/'/g, '"')

    // replace 1e3 to 1000
    .replace(/\b\d+e\d+\b/g, (text) => {
      const [pre, sub] = text.split('e')
      return `${pre}${_.repeat('0', parseInt(sub, 10))}`
    })

    // break inline ->
    .replace(/-> (.*)/, `->\n${setDepth(depth + 1)}$1\n`)

    // break then
    .replace(/ then (.*)/, `\n${setDepth(depth + 1)}$1`)

    // break else
    .replace(/ else (.*)/, `\n${setDepth(depth)}else\n${setDepth(depth + 1)}$1`)
    .replace(/else (?!if)(.*)/, `else\n${setDepth(depth + 1)}$1`)

  return `${setDepth(depth)}${line}`
}

function main(
  listMain: string[]
): string[] {

  const listResult: string[] = []

  for (const line of transpileArrayInline(listMain)) {
    const _line = formatLine(line)
    if (!_line) continue
    listResult.push(_line)
  }

  listResult.push('')
  return listResult
    .join('\n')
    .split('\n')
}

function transpileArrayInline(
  list: string[]
): string[] {

  return list

    .join('__break__')

    // []
    .replace(/\[[^\[]*?\]/g, (text) => text
      .replace(/\s*__break__\s*/g, '__comma__')
      .replace(/\[__comma__/g, '[')
      .replace(/__comma__\]/g, ']')
      .replace(/__comma__/g, ', ')
    )

    .split('__break__')
}

// export
export default main