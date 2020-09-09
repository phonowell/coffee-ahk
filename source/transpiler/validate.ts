import $ from 'fire-keeper'

// variable

const listForbidden = [
  '::',
  '=>',
  '@',
  'case',
  'class',
  'exclude',
  'export',
  'import',
  'include',
  'interface',
  'prototype',
  'switch',
  'until',
  'when',
  'while'
] as const

// function

function log<T extends string>(
  message: T,
  i: number
): T {

  $.i(`line ${i + 1}: ${message}`)
  return message
}

function main(
  raw: string
): boolean {

  let result = true

  const listRaw = raw.split('\n')
  listRaw.forEach((line, i) => {

    // block comment
    if (line.includes('###')) {
      log('found block comment', i)
      result = false
    }

    // skip comment
    if (line.trim().startsWith('#')) return

    if (line.includes('# ')) {
      log('found inline comment', i)
      result = false
    }

    // forbidden words
    for (const word of listForbidden) {
      if (!line.includes(word)) continue
      log(`found forbidden word '${word}'`, i)
      result = false
    }
  })

  return result
}

// export
export default main