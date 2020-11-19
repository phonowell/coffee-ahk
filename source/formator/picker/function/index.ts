import count from './counter'
import $do from './do'
import injectContext from './context'
import pickAnonymous from './anonymous'
import transParam from './parameter'
import validate from './validator'
import mark from './mark'

// interface

import { Context } from '../../type'

// function

function main(
  ctx: Context
): void {

  // from `fn: identifier(...)`
  // to `fn: function(...)`
  mark(ctx)

  // list
  let listFn = count(ctx)
  validate(listFn)

  // replace ctx in parameter
  // from `fn(a = a)` to `fn(a)`
  injectContext(ctx)

  // anonymous
  if (listFn.has('anonymous')) {
    pickAnonymous(ctx)
    listFn = count(ctx) // re-count
  }

  transParam(ctx, listFn)

  $do(ctx)
}

// export
export default main