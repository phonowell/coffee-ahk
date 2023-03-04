import { Context } from '../entry/type'

import partArray from './array'
import partBracket from './bracket'
import partBuildIn from './build-in'
import partClass from './class'
import partFor from './for'
import partFunction from './function'
import partObject from './object'
import partVariable from './variable'

// interface

// variable

const map = {
  array: partArray,
  bracket: partBracket,
  for: partFor,
  object: partObject,
  variable: partVariable,
} as const

// function

const main = (ctx: Context): void => {
  for (const key of Object.keys(map)) map[key](ctx)

  partBuildIn(ctx)
  partClass(ctx)
  partFunction(ctx)
}

// export
export default main
