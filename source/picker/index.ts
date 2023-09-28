import { Context } from '../types'

import partArray from './array'
import partBuildIn from './build-in'
import partClass from './class'
import partFor from './for'
import partFunction from './function'
import partNewLine from './new-line'
import partObject from './object'
import partVariable from './variable'

// interface

// variable

const map: Record<string, (ctx: Context) => void> = {
  array: partArray,
  for: partFor,
  newLine: partNewLine,
  object: partObject,
  variable: partVariable,
} as const

// function

const main = (ctx: Context) => {
  for (const key of Object.keys(map)) map[key](ctx)

  partBuildIn(ctx)
  partClass(ctx)
  partFunction(ctx)
}

// export
export default main
