import $ from 'fire-keeper'
import _ from 'lodash'
import coffee from 'coffeescript'

import cache from './class/cache'
import content from './class/content'

import transpile from './transpiler'
import pick from './picker'
import render from './renderer'

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

    transpile(ctx)
  }

  pick(ctx)

  content
    .unshift('new-line', 0)
    .unshift('new-line', 0)
    .unshift('origin', '; generated by coffee-ahk/0.0.1')

  console.log(content)
  return render(ctx)
}

// export
export default main