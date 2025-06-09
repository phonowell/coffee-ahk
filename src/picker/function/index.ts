import pickAnonymous from './anonymous.js'
import partAwait from './await.js'
import partClass from './class.js'
import injectContext from './context.js'
import count from './count.js'
import partDo from './do.js'
import injectImplicitParameter from './implicit-parameter.js'
import injectImplicitReturn from './implicit-return.js'
import mark from './mark.js'
import transParam from './parameter.js'
import returnFunction from './return-function.js'

import type { Context } from '../../types'

const main = (ctx: Context) => {
  partAwait(ctx)

  // mark function
  // change its type from `fn: identifier(...)`
  // to `fn: function(...)`
  mark(ctx)

  // list all functions
  let setFn = count(ctx)

  partClass(ctx)

  injectImplicitParameter(ctx)
  injectImplicitReturn(ctx)

  // replace ctx in parameter
  // from `fn(a = a)` to `fn(a)`
  injectContext(ctx)

  // anonymous
  if (ctx.option.pickAnonymous && setFn.has('anonymous')) {
    pickAnonymous(ctx)
    setFn = count(ctx) // re-count
  }

  transParam(ctx, setFn)

  partDo(ctx)

  returnFunction(ctx)
}

export default main
