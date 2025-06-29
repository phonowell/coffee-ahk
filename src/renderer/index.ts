// Main renderer orchestrator
import {
  identifier2,
  logicalOperator2,
  negative2,
  newLine2,
  sign2,
  statement2,
} from './basic.js'
import { getCacheComment, injectComment, setCacheComment } from './comments.js'
import { if2, try2 } from './control-flow.js'
import { edge2 } from './edge.js'

import type Item from '../models/Item.js'
import type { Context as Context2 } from '../types'

type Context = Context2 & {
  i: number
  it: Item
}

const main = (ctx: Context2): string => {
  const content = ctx.content.list
    .map((it, i) => {
      const context: Context = { ...ctx, i, it }

      if (it.comment) {
        const cacheComment = getCacheComment()
        setCacheComment([...cacheComment, ...it.comment])
      }

      for (const key of Object.keys(mapMethod)) {
        if (it.type === key) {
          const method = mapMethod[key]
          const value =
            typeof method === 'string'
              ? method.replace(/~/g, it.value)
              : method(context)

          return injectComment(value, context)
        }
      }
      return injectComment(it.value, context)
    })
    .join('')

  return content
}

const mapMethod: Record<string, string | ((ctx: Context) => string)> = {
  'for-in': ' in ',
  'logical-operator': logicalOperator2,
  'new-line': newLine2,
  async: 'async ',
  await: 'await ',
  class: 'class ',
  compare: ' ~ ',
  edge: edge2,
  for: 'for ',
  identifier: identifier2,
  if: if2,
  math: ' ~ ',
  negative: negative2,
  sign: sign2,
  statement: statement2,
  super: 'base',
  try: try2,
  void: '',
  while: 'while ',
} as const

export default main
