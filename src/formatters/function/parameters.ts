// Parameter handling
import type { Context } from '../../types'

export const handleParamStart = (ctx: Context) => {
  const { content, scope } = ctx

  if (!content.at(-2)?.is('property', 'constructor'))
    content.push({ type: 'identifier', value: 'anonymous' })

  scope.push('parameter')
  content.push({ type: 'edge', value: 'parameter-start' })
  return true
}

export const handleParamEnd = (ctx: Context) => {
  ctx.content.push({ type: 'edge', value: 'parameter-end' })
  ctx.scope.pop()
  return true
}
