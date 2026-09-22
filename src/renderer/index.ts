import {
  renderIdentifier,
  renderLogicalOperator,
  renderNegative,
  renderNewLine,
  renderSign,
  renderStatement,
} from './basic.js'
import { renderIf, renderTry } from './control-flow.js'
import { renderEdge } from './edge.js'

import type { ItemType } from '../models/ItemType.js'
import type { Context, RenderContext } from '../types/index.js'

type Renderer = string | ((ctx: RenderContext) => string)

const renderers: Partial<Record<ItemType, Renderer>> = {
  class: 'class ',
  compare: (ctx: RenderContext): string => ` ${ctx.it.value} `,
  edge: renderEdge,
  for: (ctx: RenderContext): string => {
    const prev = ctx.content.toArray().at(ctx.i - 1)
    return prev && !['new-line', 'edge'].includes(prev.type) ? ' for ' : 'for '
  },
  'for-in': ' in ',
  identifier: renderIdentifier,
  if: renderIf,
  'logical-operator': renderLogicalOperator,
  math: (ctx: RenderContext): string =>
    // Bitwise NOT is unary, no leading space
    ctx.it.value === '~' ? '~' : ` ${ctx.it.value} `,
  negative: renderNegative,
  'new-line': renderNewLine,
  prototype: 'prototype',
  sign: renderSign,
  statement: renderStatement,
  super: 'base',
  try: renderTry,
  while: 'while ',
}

const renderComments = (
  ctx: RenderContext,
  output: string,
): { commentPrefix: string; output: string } => {
  let commentPrefix = ''

  // Handle standalone comments
  if (ctx.it.comment && ctx.options.comments) {
    const hasStandaloneComment = ctx.it.comment.some((c) => c.startsWith('STANDALONE:'))

    if (hasStandaloneComment) {
      const prevItem = ctx.content.toArray().at(ctx.i - 1)
      const scopeLast = ctx.it.scope.last
      const indent = ' '.repeat(parseInt(scopeLast || '0', 10) * 2)

      // If previous item is not newline, add newline before comment
      if (prevItem && prevItem.type !== 'new-line') commentPrefix += '\n'

      ctx.it.comment.forEach((commentLine) => {
        if (commentLine.startsWith('STANDALONE:')) {
          const text = commentLine
            .substring(11)
            .trim()
            .replace(/^#+\s*/, '')
            .replace(/;+$/, '')
          if (text) commentPrefix += `${indent}; ${text}\n`
        }
      })

      commentPrefix += indent
    }
  }

  // Handle inline comments
  if (ctx.it.comment && ctx.options.comments) {
    const inlineComments = ctx.it.comment
      .filter((c) => c.startsWith('INLINE:'))
      .map((c) =>
        c
          .substring(7)
          .trim()
          .replace(/^#+\s*/, '')
          .replace(/;+$/, ''),
      )
      .filter(Boolean)

    if (inlineComments.length > 0) output += `  ; ${inlineComments.join(' ')}`
  }

  return { commentPrefix, output }
}

const main = (ctx: Context): string =>
  ctx.content
    .toArray()
    .map((it, i) => {
      const context: RenderContext = { ...ctx, i, it }

      const method = renderers[it.type]
      let output =
        method === undefined ? it.value : typeof method === 'string' ? method : method(context)

      const { commentPrefix, output: rendered } = renderComments(context, output)
      output = rendered

      return commentPrefix + output
    })
    .join('')

export default main
