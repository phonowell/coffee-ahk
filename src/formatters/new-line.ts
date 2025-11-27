import type { Context } from '../types'

const handleClosingBracket = (content: Context['content']): void => {
  const last = content.at(-1)
  if (last?.is('bracket', '}-')) last.value = '}'
}

const handleCommaInScope = (
  content: Context['content'],
  scope: Context['scope'],
): boolean => {
  if (['array', 'call', 'object', 'parameter'].includes(scope.last)) {
    if (!content.at(-1)?.is('sign', ',')) {
      if (content.at(-1)?.is('new-line')) content.pop()
      content.push({ type: 'sign', value: ',' })
    }
    return true
  }
  return false
}

const handleNewLine = (ctx: Context): boolean => {
  const { content, scope } = ctx

  handleClosingBracket(content)

  if (handleCommaInScope(content, scope)) return true

  content.push({ type: 'new-line', value: ctx.indent.toString() })
  return true
}

const handleSemicolon = (ctx: Context): boolean => {
  const { content } = ctx

  handleClosingBracket(content)
  content.push({ type: 'new-line', value: ctx.indent.toString() })
  return true
}

const main = (ctx: Context): boolean => {
  const { type, value } = ctx

  if (type === 'terminator') {
    if (value === '\n') return handleNewLine(ctx)

    if (value === ';') return handleSemicolon(ctx)
  }

  return false
}

export default main
