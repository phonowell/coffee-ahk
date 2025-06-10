import asArray from './array/index.js'
import asBuildIn from './build-in.js'
import asClass from './class/index.js'
import asFor from './for.js'
import asFunction from './function/index.js'
import asNewLine from './new-line.js'
import asObject from './object.js'
import asVariable from './variable/index.js'

import type { Context } from '../types'

const main = (ctx: Context) => {
  asNewLine(ctx) // have to be first

  asFor(ctx)
  asArray(ctx)
  asObject(ctx)
  asVariable(ctx)

  asBuildIn(ctx)
  asClass(ctx)
  asFunction(ctx)
}

export default main
