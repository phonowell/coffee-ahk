import { getDepth, setDepth } from './fn'

// interface

import { Block } from '../type'

// function

function checkOriginal(
  name: string
): boolean {

  if (!(name.includes('.') || name.includes('[')))
    return false

  if (name.startsWith('$.'))
    return false

  if (name.startsWith('Math.'))
    return false

  return true
}

function filterType(
  line: string
): [string, string] {

  let type: string = ''

  if (line.startsWith('return ')) {
    type = 'return'
    line = line.replace('return ', '')
  } else if (line.startsWith('if (')) {
    type = 'if'
    line = line.replace('if (', '')
  } else if (line.startsWith('if !(')) {
    type = 'unless'
    line = line.replace('if !(', '')
  } else if (line.startsWith('else if (')) {
    type = 'else-if'
    line = line.replace('else if (', '')
  }

  line = line.replace(') {', '')

  return [type, line]
}

function format(
  line: string
): string {

  const depth = getDepth(line)

  // remove await
  line = line
    .trim()
    .replace(/await\s+/g, '')

  // validate
  if (!validate(line))
    return `${setDepth(depth)}${line}`

  let type: string
  [type, line] = filterType(line)

  let isInvalid: boolean

  let result = line
    .replace(/[^\s=\()\{},\+\-\*\/]+\s+[^=]+/g, (text) => {

      if (text.search(/[=<>]/) !== -1) return text

      const [key, ..._value] = text.split(' ')
      const value = (_value.join(' ')).trim()

      isInvalid = [
        key === 'if',
        key.endsWith(':'),
        // ---
        value === '!',
        value.startsWith('and '),
        value.startsWith('or '),
        value.startsWith('+ '),
        value.startsWith('- '),
        value.startsWith('* '),
        value.startsWith('/ '),
        value.startsWith('> '),
        value.startsWith('< '),
        value.startsWith('!= '),
        value.startsWith('== ')
      ].includes(true)
      if (isInvalid) return text
      if (checkOriginal(key)) return `${key}.Call(${value})`
      return `${key}(${value})`
    })

  if (type === 'return')
    result = `return ${result}`
  else if (type === 'if')
    result = `if (${result}) {`
  else if (type === 'unless')
    result = `if !(${result}) {`
  else if (type === 'else-if')
    result = `else if (${result}) {`

  return `${setDepth(depth)}${result}`
}

function main(
  listVar: string[],
  listBlock: Block[]
): void {

  listVar.forEach((line, i) =>
    listVar[i] = format(line)
  )

  listBlock.forEach(block =>
    block.content = block.content.map(line => format(line))
  )
}

function validate(
  text: string
): boolean {

  const list = [
    'else {',
    'for ',
    'loop '
  ] as const

  let result = true
  for (const key of list) {
    if (!text.includes(key)) continue
    result = false
    break
  }

  return result
}

// export
export default main