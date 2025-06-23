// Function call handling
import type { Context } from '../../types'

export const handleCallStart = (ctx: Context) => {
  const { scope } = ctx
  ctx.flag.isFunctionIncluded = true
  const { next } = scope
  scope.next = ''
  scope.push('call')
  scope.next = next
  ctx.content.push('edge', 'call-start')
  return true
}

export const handleCallEnd = (ctx: Context) => {
  const { content, scope } = ctx

  // Native(string)
  const listItem = [content.at(-3), content.at(-2), content.at(-1)]
  if (
    listItem[0]?.is('identifier', 'Native') &&
    listItem[1]?.is('edge', 'call-start') &&
    listItem[2]?.is('string')
  ) {
    listItem[0].type = 'void'
    listItem[1].type = 'void'
    listItem[2].scope.pop()
    listItem[2].type = 'native'
    const { value } = listItem[2]
    listItem[2].value = value
      .substring(1, value.length - 1)
      .replace(/`%/g, '%')
      .replace(/"{2,}/g, '"')
    content.push('void', 'call-end')
    scope.pop()
    return true
  }

  content.push('edge', 'call-end')
  scope.pop()
  return true
}
