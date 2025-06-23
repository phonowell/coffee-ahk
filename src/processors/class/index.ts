import count from './count.js'
import validate from './validate.js'

import type { Context } from '../../types'

const main = (ctx: Context) => {
  // list all classes
  const setClass = count(ctx)
  validate(setClass)

  // console.log(setClass)
}

export default main
