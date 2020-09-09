import _ from 'lodash'
import { getDepth, setDepth } from './fn'

// interface

import { Block } from '../type'

// function

function replace(
  content: string[]
): string[] {

  const listCache: number[] = []
  const listResult: string[] = []

  for (let line of content) {

    line = line.replace('unless', 'not-if')

    const n = getDepth(line)
    const m = _.last(listCache)
    if (typeof m === 'number' && n <= m) {

      const j = _.indexOf(listCache, n)
      const list = listCache.slice(j)
      list.reverse()

      for (const k of list) {
        listCache.pop()
        listResult.push(`${setDepth(k)}}`)
      }
    }

    if (line.search(/(if |else)/) !== -1) {
      listCache.push(n)

      const _line = `${line} {`
        .replace(/if\s+(.*?)\s+{/, 'if ($1) {')
        .replace('not-if (', 'if !(')

      listResult.push(_line)
      continue
    }

    listResult.push(line)
  }

  return listResult
}

function main(
  listBlock: Block[]
): void {

  listBlock.forEach(block =>
    block.content = replace(block.content)
  )
}

// export
export default main