import _ from 'lodash'
import { getDepth, initBlock } from './fn'

// interface

import { Block } from '../type'

// function

function format(
  text: string
): string {

  return text
    .toLowerCase()
    .replace(/[\s-]/g, '')
    .replace(/\+/g, '&')
    // ---
    .replace(/alt&?/g, '!')
    .replace(/control&?/g, '^')
    .replace(/ctrl&?/g, '^')
    .replace(/shift&?/g, '+')
    .replace(/win&?/g, '#')
    // ---
    .replace(/(clickmiddle|middleclick)/g, 'mbutton')
    .replace(/(clickright|rightclick)/g, 'rbutton')
    .replace(/(click|clickleft|leftclick)/g, 'lbutton')
    // ---
    .replace(/&/g, ' & ')
    .replace(/:/g, ' ')
}

function getName(
  line: string
): string {

  const name = line
    .replace(/\s/g, '')
    .replace('$.on', '')
    .replace(',->', '')

  return format(_.trim(name, " '\""))
}

function main(
  listMain: string[]
): {
  event: Block[]
  main: string[]
} {

  const listContent: string[] = []
  const listEvent: Block[] = []

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
      listEvent.push(block)
      block = initBlock()
    }

    if (!validate(line)) {
      listContent.push(line)
      continue
    }

    isPending = true
    block.name = getName(line)
  }

  return {
    event: listEvent,
    main: listContent
  }
}

function validate(
  line: string
): boolean {

  if (getDepth(line)) return false

  line = line.trim()
  if (!line.startsWith('$.on')) return false
  if (!line.endsWith('->')) return false

  return true
}

// export
export default main