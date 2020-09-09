import $ from 'fire-keeper'
import _ from 'lodash'
import coffee from 'coffeescript'

import translate from './translator'

import cacheArray from './cache/array'
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
  'index_start',
  'terminator'
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
    cacheArray,
    cacheBlock,
    indent: 0,
    listResult: [],
    raw: {},
    type: ''
  }

  for (const token of ast.tokens) {

    ctx.raw = token
    ctx.type = token[0].toLowerCase()
    $.i(ctx.raw)

    // wrap
    ~function () {

      if (translate('indent', ctx)) return

      if (translate('function', ctx)) return
      if (translate('if', ctx)) return

      if (translate('indentifier', ctx)) return
      if (translate('array', ctx)) return
      if (translate('number', ctx)) return
      if (translate('string', ctx)) return

      // simple
      if (listOther.includes(ctx.type as typeof listOther[number])) {
        ctx.listResult.push(token[1])
        return
      }
    }()

    translate('comment', ctx)
  }

  return ctx.listResult.join('')
}

// export
export default main