import _ from 'lodash'
import { encodeFnName, getDepth, initBlock } from './fn'

// interface

import { Block } from '../type'

// function

function getName(
  line: string
): [string, string[]] {

  const [name, ...arg] = line
    .trim()
    .replace(/->/, '')
    .split('=')

  return [
    name.trim(),
    _.trim(arg.join('='), ' ()')
      .split(',')
  ]
}

function main(
  listMain: string[]
): {
  fn: Block[]
  main: string[]
} {

  const listContent: string[] = []
  const listFn: Block[] = []

  let block = initBlock()
  let isPending: boolean = false

  for (const line of listMain) {

    if (isPending) {

      if (getDepth(line)) {
        block.content.push(line.replace('  ', ''))
        continue
      }

      isPending = false
      block.content.push('')
      listFn.push(block)
      block = initBlock()
    }

    if (!validate(line)) {
      listContent.push(line)
      continue
    }

    isPending = true
    const [name, argument] = getName(line)

    let _name: string
    if (name.includes('.')) {
      _name = encodeFnName(name)
      listContent.push(`${name} = Func('${_name}')`)
    } else
      _name = name

    block.name = _name
    block.argument = argument
  }

  return {
    fn: listFn,
    main: listContent
  }
}

function validate(
  line: string
): boolean {

  if (getDepth(line)) return false

  line = line.trim()
  if (line.startsWith('$.')) return false
  if (!line.endsWith('->')) return false

  return true
}

// export
export default main