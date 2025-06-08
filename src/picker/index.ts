import partArray from './array'
import partBuildIn from './build-in'
import partClass from './class'
import partFor from './for'
import partFunction from './function'
import partNewLine from './new-line'
import partObject from './object'
import partVariable from './variable'

import type { Context } from '../types'

const map: Record<string, (ctx: Context) => void> = {
  array: partArray,
  for: partFor,
  newLine: partNewLine,
  object: partObject,
  variable: partVariable,
} as const

const main = (ctx: Context) => {
  for (const key of Object.keys(map)) map[key](ctx)

  partBuildIn(ctx)
  partClass(ctx)
  partFunction(ctx)
}

export default main
