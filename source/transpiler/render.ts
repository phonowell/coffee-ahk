import { encodeFnName, unquote } from './fn'

// interface

import { Block, Data, Option } from '../type'

// function

function main(
  data: Data,
  option: Option
): string {

  let listResult: string[] = []

  // head
  if (!option.bare)
    listResult = [
      ...listResult,
      ...data.head
    ]

  // global variable
  if (data.var.length)
    listResult = [
      ...listResult,
      '',
      '; global variable',
      '',
      ...(renderGlobalVariable(data.var))
    ]

  // function
  if (data.fn.length)
    listResult = [
      ...listResult,
      '',
      '; function',
      '',
      ...(renderFunction(data.fn))
    ]

  // main
  if (data.main.join('\n').trim())
    listResult = [
      ...listResult,
      '',
      '; default',
      `${encodeFnName('$default')}()`
    ]

  // event
  if (data.event.length)
    listResult = [
      ...listResult,
      '',
      '; event',
      '',
      ...(renderEvent(data.event))
    ]

  // foot
  if (!option.bare)
    listResult = [
      ...listResult,
      '',
      ...data.foot
    ]

  listResult.forEach((value, i) =>
    listResult[i] = value.trimEnd()
  )

  return listResult
    .join('\n')
    .trim()
    .replace(/\n{2,}/g, '\n\n')
    .replace(/'/g, '"')
    .replace(/\s=\s/g, ' := ')
}

function renderEvent(
  list: Block[]
): string[] {

  let listResult: string[] = []

  for (const block of list) {

    const listContent: string[] = []
    for (const line of block.content) {
      if (!line.trim()) continue
      listContent.push(`  ${unquote(line)}`)
    }

    listResult = [
      ...listResult,
      '',
      `${block.name}::`,
      ...listContent,
      'return'
    ]
  }

  return listResult
}

function renderFunction(
  list: Block[]
): string[] {

  let listResult: string[] = []

  for (const block of list) {

    const listContent: string[] = []
    for (const line of block.content) {
      if (!line.trim()) continue
      listContent.push(`  ${unquote(line)}`)
    }

    listResult = [
      ...listResult,
      '',
      `${block.name}(${unquote(block.argument.join(', '))}) {`,
      ...listContent,
      '}'
    ]
  }

  return listResult
}

function renderGlobalVariable(
  list: string[]
): string[] {

  const listResult: string[] = []

  for (const line of list)
    listResult.push(unquote(`global ${line}`))

  return listResult
}

// export
export default main