import $ from 'fire-keeper'
import _ from 'lodash'
import coffee from 'coffeescript'

import cache from './class/cache'
import content from './class/content'
import format from './module'

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

// function

function main(
  cont: string
): string {

  const ast = coffee.compile(cont, {
    ast: true
  })

  cache.clear()
  content.clear()
  const ctx: Context = {
    cache,
    content,
    indent: 0,
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

      const listMethod: readonly (
        Parameters<typeof format>[0]
      )[] = [
        'alias',
        'array',
        'forbidden',
        'function',
        'if',
        'indent',
        'indentifier',
        'key',
        'new-line',
        'number',
        'object',
        'operator',
        'punctuation',
        'string',
        'while'
      ] as const

      for (const key of listMethod)
        if (format(key, ctx)) return
    }()

    // have to be the last of all
    format('comment', ctx)
  }

  console.log(ctx.content)
  return ctx.content.render()
}

// export
export default main