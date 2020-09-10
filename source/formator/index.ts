import $ from 'fire-keeper'
import _ from 'lodash'
import coffee from 'coffeescript'

import format from './module'
import cacheBlock from './cache/block'

// interface

import { Context } from './type'

declare global {
  const coffee: {
    compile: (
      content: string,
      option?: {
        ast?: boolean
      }
    ) => unknown
  }
}

// variable

const listOther = [
  'index_end',
  'index_start'
] as const

// function

function main(
  content: string
): string {

  const ast = coffee.compile(content, {
    ast: true
  })

  cacheBlock.clear()
  const ctx: Context = {
    cacheBlock,
    indent: 0,
    listResult: [],
    raw: {},
    type: '',
    value: ''
  }

  for (const token of ast.tokens) {

    ctx.raw = token
    ctx.raw[2] = undefined
    ctx.type = token[0].toLowerCase()
    ctx.value = token[1].toString()
    $.i(ctx.raw)

    // wrap
    ~function () {

      if (format('indent', ctx)) return
      if (format('break', ctx)) return

      if (format('function', ctx)) return
      if (format('if', ctx)) return

      if (format('punctuation', ctx)) return
      if (format('indentifier', ctx)) return
      if (format('number', ctx)) return
      if (format('string', ctx)) return
      if (format('array', ctx)) return
      if (format('object', ctx)) return

      // simple
      if (listOther.includes(ctx.type as typeof listOther[number])) {
        ctx.listResult.push(token[1])
        return
      }
    }()

    // have to be the last of all
    format('comment', ctx)
  }

  console.log(ctx.listResult)
  return ctx.listResult.join('')
}

// export
export default main