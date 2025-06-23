// Main function formatter orchestrator
import { arrow } from './function/arrow.js'
import { handleCallEnd, handleCallStart } from './function/calls.js'
import { handleParamEnd, handleParamStart } from './function/parameters.js'

import type { Context } from '../types'

const main = (ctx: Context) => {
  const { type } = ctx

  if (['->', '=>'].includes(type)) return arrow(ctx, type)

  if (type === 'call_start') return handleCallStart(ctx)

  if (type === 'call_end') return handleCallEnd(ctx)

  if (type === 'param_start') return handleParamStart(ctx)

  if (type === 'param_end') return handleParamEnd(ctx)

  return false
}

export default main
