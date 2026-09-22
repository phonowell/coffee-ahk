import type { RenderContext } from '../types/index.js'

export const renderIf = (ctx: RenderContext): string => {
  const { content, i, it } = ctx
  const { value } = it

  if (value === 'case') return 'case '
  if (value === 'default') return 'default'
  if (value === 'else') return ' else'

  if (value === 'if') {
    const prev = content.at(i - 1)
    if (prev?.is('if', 'else')) return ' if '
    return 'if '
  }

  if (value === 'switch') return 'switch '
  return ''
}

export const renderTry = (ctx: RenderContext): string => {
  const { content, i, it } = ctx
  const { value } = it

  if (value === 'catch') {
    const next = content.at(i + 1)
    if (next?.is('edge', 'block-start')) return ' catch'
    return ' catch '
  }

  if (value === 'finally') return ' finally'
  if (value === 'try') return 'try'
  return ''
}
