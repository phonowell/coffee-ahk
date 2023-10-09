import { compile } from 'coffeescript'

import transpile from '../formator'
import Content from '../module/Content'
import pick from '../picker'
import render from '../renderer'
import { Context } from '../types'
import Scope from '../module/Scope'

// interface

type Result = {
  ast: Context['content']['list']
  content: string
  raw: Context['raw'][]
}

// function

const main = (cont: string, option: Context['option']): Result => {
  const ast = compile(cont, {
    ast: true,
  })

  const scope = new Scope()
  const content = new Content(scope)

  const ctx: Context = {
    cache: {
      global: new Set(),
    },
    content,
    flag: {
      isChangeIndexUsed: false,
      isFunctionIncluded: false,
    },
    indent: 0,
    option,
    raw: {},
    scope,
    type: '',
    value: '',
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
    raw: ast.tokens,
  }
}

// export
export default main
