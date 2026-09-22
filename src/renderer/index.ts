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
    const prev = ctx.list.at(ctx.i - 1)
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
  indentDepth: number,
): { commentPrefix: string; output: string } => {
  let commentPrefix = ''

  // Handle standalone comments
  if (ctx.it.comment && ctx.options.comments) {
    const standaloneTexts = ctx.it.comment
      .filter((c) => c.startsWith('STANDALONE:'))
      .map((c) =>
        c
          .substring(11)
          .trim()
          .replace(/^#+\s*/, '')
          .replace(/;+$/, ''),
      )
      .filter(Boolean)

    if (standaloneTexts.length) {
      const prevItem = ctx.list.at(ctx.i - 1)
      const indent = ' '.repeat(indentDepth * 2)
      // A preceding new-line already emitted this line's indent —
      // only break the line; otherwise start a new indented line first
      const atLineStart = prevItem?.type === 'new-line'

      if (!atLineStart) commentPrefix += '\n'

      standaloneTexts.forEach((text, idx) => {
        const needsIndent = !(atLineStart && idx === 0)
        commentPrefix += `${needsIndent ? indent : ''}; ${text}\n`
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

const main = (ctx: Context): string => {
  // Single snapshot for the whole render pass (was O(n²) via toArray() per item)
  const list = ctx.content.toArray()
  // Tracks the depth of the line currently being rendered (new-line value = depth)
  let indentDepth = 0

  return list
    .map((it, i) => {
      if (it.type === 'new-line') indentDepth = parseInt(it.value, 10) || 0

      const context: RenderContext = { ...ctx, i, it, list }

      const method = renderers[it.type]
      let output =
        method === undefined ? it.value : typeof method === 'string' ? method : method(context)

      const { commentPrefix, output: rendered } = renderComments(context, output, indentDepth)
      output = rendered

      return commentPrefix + output
    })
    .join('')
}

export default main
