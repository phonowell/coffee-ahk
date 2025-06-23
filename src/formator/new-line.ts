import type { Context } from '../types'

const handleClosingBracket = (content: Context['content']): void => {
  if (content.last.is('bracket', '}-')) content.last.value = '}'
}

const handleCommaInScope = (
  content: Context['content'],
  scope: Context['scope'],
): boolean => {
  if (['array', 'call', 'object', 'parameter'].includes(scope.last)) {
    if (!content.last.is('sign', ',')) {
      if (content.last.is('new-line')) content.pop()
      content.push('sign', ',')
    }
    return true
  }
  return false
}

const handleNewLine = (ctx: Context): boolean => {
  const { content, scope } = ctx

  handleClosingBracket(content)

  if (handleCommaInScope(content, scope)) return true

  content.push('new-line', ctx.indent.toString())
  return true
}

const handleSemicolon = (ctx: Context): boolean => {
  const { content } = ctx

  handleClosingBracket(content)
  content.push('new-line', ctx.indent.toString())
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
