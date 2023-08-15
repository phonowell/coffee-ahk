import { Context } from '../../types'

import count from './count'
import validate from './validate'

// function

const main = (ctx: Context): void => {
  // list all classes
  const setClass = count(ctx)
  validate(setClass)

  // console.log(setClass)
}

// export
export default main
