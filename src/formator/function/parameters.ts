// Parameter handling
import type { Context } from '../../types'

export const handleParamStart = (ctx: Context) => {
  const { content, scope } = ctx

  if (!content.at(-2)?.is('property', 'constructor'))
    content.push('identifier', 'anonymous')

  scope.push('parameter')
  content.push('edge', 'parameter-start')
  return true
}

export const handleParamEnd = (ctx: Context) => {
  ctx.content.push('edge', 'parameter-end')
  ctx.scope.pop()
  return true
}
