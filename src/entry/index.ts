import { compile } from 'coffeescript'

import processFormatters from '../formatters/index.js'
import Content from '../models/Content.js'
import Scope from '../models/Scope.js'
import processAst from '../processors/index.js'
import render from '../renderer/index.js'

import type { Context } from '../types'

type Result = {
  ast: Context['content']['list']
  content: string
  raw: Context['token'][]
  warnings: string[]
}

const main = async (
  cont: string,
  option: Context['options'],
): Promise<Result> => {
  const ast = compile(cont, {
    ast: true,
  })

  const scope = new Scope()
  const content = new Content(scope)

  const ctx: Context = {
    cache: {
      global: new Set(),
      classNames: new Set(),
      identifiers: new Set(),
    },
    content,
    flag: {
      isChangeIndexUsed: false,
    },
    indent: 0,
    options: option,
    token: undefined as unknown as Context['token'],
    scope,
    type: '',
    value: '',
    warnings: [],
  }

  for (const token of ast.tokens) {
    ctx.token = token
    ctx.type = token[0].toLowerCase()
    ctx.value = token[1].toString()

    processFormatters(ctx)
  }

  await processAst(ctx)

  return {
    ast: content.list,
    content: render(ctx).trim(),
    raw: ast.tokens,
    warnings: ctx.warnings,
  }
}

export default main
