import count from './count'
import validate from './validate'
import { Context } from '../../entry/type'

// function

const main = (ctx: Context): void => {
  // list all classes
  let setClass = count(ctx)
  validate(setClass)

  // console.log(setClass)
}

// export
export default main
