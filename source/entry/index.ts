import { Context } from './type'
import coffee from 'coffeescript'
import content from '../module/Content'
import pick from '../picker'
import render from '../renderer'
import scope from '../module/Scope'
import transpile from '../formator'

// interface

type Coffee = {
  compile: (
    // eslint-disable-next-line no-shadow
    content: string,
    option?: {
      ast?: boolean
    }
  ) => unknown
}

type Result = {
  ast: Context['content']['list']
  content: string
  raw: Context['raw'][]
}

declare global {
  // eslint-disable-next-line init-declarations, no-shadow
  const coffee: Coffee
}

// function

const main = (cont: string, option: Context['option']): Result => {
  const ast = coffee.compile(cont, {
    ast: true,
  })

  scope.clear()
  content.clear()
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
