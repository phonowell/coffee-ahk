import arrayProcessor from './array/index.js'
import builtInLoaderProcessor from './build-in-loader.js'
import classProcessor from './class/index.js'
import forProcessor from './for.js'
import functionProcessor from './function/index.js'
import newLineProcessor from './new-line.js'
import objectProcessor from './object.js'
import variableProcessor from './variable/index.js'

import type { Context } from '../types'

/** Process AST transformations */
const processAst = async (context: Context) => {
  newLineProcessor(context) // have to be first

  forProcessor(context)
  arrayProcessor(context)
  objectProcessor(context)
  variableProcessor(context)

  await builtInLoaderProcessor(context)
  classProcessor(context)
  functionProcessor(context)
}

export default processAst
