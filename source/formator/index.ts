import _ from 'lodash'
import coffee from 'coffeescript'

import scope from './module/scope'
import content from './module/content'

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
  cont: string,
  option: Context['option']
): {
  ast: Context['content']['list']
  content: string,
  raw: Context['raw'][]
} {

  const ast = coffee.compile(cont, {
    ast: true
  })

  scope.clear()
  content.clear()
  const ctx: Context = {
    content,
    flag: {},
    indent: 0,
    option,
    raw: {},
    scope,
    type: '',
    value: ''
  }

  for (const token of ast.tokens) {

    ctx.raw = token
    ctx.raw[2] = {}
    ctx.type = token[0].toLowerCase()
    ctx.value = token[1].toString()

    transpile(ctx)
  }

  pick(ctx)

  return {
    ast: content.list,
    content: render(ctx),
    raw: ast.tokens
  }
}

// export
export default main