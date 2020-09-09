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

  for (const line of content) {

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

    if (line.startsWith('$.loop')) {
      listCache.push(n)

      const _line = line
        .replace(/\$\.loop\s+([^,]+,\s+)?->/g, (text) => {

          const n = text
            .replace(/[\s,]/g, '')
            .replace('$.loop', '')
            .replace('->', '')
            .trim()

          if (!n) return 'loop {'
          if (!_.isNaN(parseInt(n, 10))) return `loop ${n} {`
          return `loop %${n}% {`
        })
        .replace(/\s{2,}/g, ' ')

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