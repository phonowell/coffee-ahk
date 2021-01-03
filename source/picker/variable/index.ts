import { Context } from '../../entry/type'
import boostGlobal from './boost-global'
import translateError from './translate-error'

// function

function main(
  ctx: Context
): void {

  // global
  boostGlobal(ctx)

  // new Error -> Exception
  translateError(ctx)
}

// export
export default main
