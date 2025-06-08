import pickAnonymous from './anonymous'
import partAwait from './await'
import partClass from './class'
import injectContext from './context'
import count from './count'
import partDo from './do'
import injectImplicitParameter from './implicit-parameter'
import injectImplicitReturn from './implicit-return'
import mark from './mark'
import transParam from './parameter'
import returnFunction from './return-function'

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
