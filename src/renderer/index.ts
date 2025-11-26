// Main renderer orchestrator
import {
  identifier2,
  logicalOperator2,
  negative2,
  newLine2,
  sign2,
  statement2,
} from './basic.js'
import { if2, try2 } from './control-flow.js'
import { edge2 } from './edge.js'

import type Item from '../models/Item.js'
import type { Context as Context2 } from '../types'

type Context = Context2 & {
  i: number
  it: Item
}

const main = (ctx: Context2): string => {
  const content = ctx.content
    .toArray()
    .map((it, i) => {
      const context: Context = { ...ctx, i, it }
      let output = ''
      let commentPrefix = ''

      // Handle standalone comments
      if (it.comment && ctx.options.comments) {
        const hasStandaloneComment = it.comment.some((c) =>
          c.startsWith('STANDALONE:'),
        )

        if (hasStandaloneComment) {
          const prevItem = ctx.content.toArray().at(i - 1)
          const scopeLast = it.scope.last
          const indent = ' '.repeat(parseInt(scopeLast || '0', 10) * 2)

          // If previous item is not newline, add newline before comment
          if (prevItem && prevItem.type !== 'new-line') commentPrefix += '\n'

          it.comment.forEach((commentLine) => {
            if (commentLine.startsWith('STANDALONE:')) {
              const content = commentLine
                .substring(11)
                .trim()
                .replace(/^#+\s*/, '')
                .replace(/;+$/, '')
              if (content) commentPrefix += `${indent}; ${content}\n`
            }
          })

          commentPrefix += indent
        }
      }

      // Render the item itself
      let itemRendered = false
      for (const key of Object.keys(mapMethod)) {
        if (it.type === key) {
          const method = mapMethod[key]
          if (!method) continue

          const value =
            typeof method === 'string'
              ? method.replace(/~/g, it.value)
              : method(context)

          output = value
          itemRendered = true
          break
        }
      }

      if (!itemRendered) output = it.value

      // Handle inline comments
      if (it.comment && ctx.options.comments) {
        const inlineComments = it.comment
          .filter((c) => c.startsWith('INLINE:'))
          .map((c) =>
            c
              .substring(7)
              .trim()
              .replace(/^#+\s*/, '')
              .replace(/;+$/, ''),
          )
          .filter(Boolean)

        if (inlineComments.length > 0)
          output += `  ; ${inlineComments.join(' ')}`
      }

      return commentPrefix + output
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
  for: (ctx: Context): string => {
    const prev = ctx.content.toArray().at(ctx.i - 1)
    const needsSpace = prev && !['new-line', 'edge'].includes(prev.type)
    return needsSpace ? ' for ' : 'for '
  },
  identifier: identifier2,
  if: if2,
  math: (ctx: Context): string => {
    const { value } = ctx.it
    // Bitwise NOT is unary, no leading space
    if (value === '~') return '~'
    return ` ${value} `
  },
  negative: negative2,
  sign: sign2,
  statement: statement2,
  super: 'base',
  try: try2,
  void: '',
  while: 'while ',
} as const

export default main
