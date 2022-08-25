import count from './counter'
import injectContext from './context'
import injectImplicitParamter from './implicit'
import mark from './mark'
import partAwait from './await'
import partClass from './class'
import partDo from './do'
import pickAnonymous from './anonymous'
import transParam from './parameter'
import validate from './validator'
import { Context } from '../../entry/type'

// function

const main = (ctx: Context): void => {
  partAwait(ctx)

  // mark function
  // change its type from `fn: identifier(...)`
  // to `fn: function(...)`
  mark(ctx)

  // list all functions
  let listFn = count(ctx)
  validate(listFn)

  partClass(ctx)

  injectImplicitParamter(ctx)

  // replace ctx in parameter
  // from `fn(a = a)` to `fn(a)`
  injectContext(ctx)

  // anonymous
  if (ctx.option.pickAnonymous && listFn.has('anonymous')) {
    pickAnonymous(ctx)
    listFn = count(ctx) // re-count
  }

  transParam(ctx, listFn)

  partDo(ctx)
}

// export
export default main
