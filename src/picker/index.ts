import partArray from './array/index.js'
import partBuildIn from './build-in.js'
import partClass from './class/index.js'
import partFor from './for.js'
import partFunction from './function/index.js'
import partNewLine from './new-line.js'
import partObject from './object.js'
import partVariable from './variable/index.js'

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
