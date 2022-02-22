import { Context } from '../../entry/type'
import $await from './await'
import $class from './class'
import $do from './do'
import count from './counter'
import injectContext from './context'
import injectImplicitParamter from './implicit'
import mark from './mark'
import pickAnonymous from './anonymous'
import transParam from './parameter'
import validate from './validator'

// function

const main = (
  ctx: Context
): void => {

  $await(ctx)

  // mark function
  // change its type from `fn: identifier(...)`
  // to `fn: function(...)`
  mark(ctx)

  // list all functions
  let listFn = count(ctx)
  validate(listFn)

  $class(ctx)

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

  $do(ctx)
}

// export
export default main