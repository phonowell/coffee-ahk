import { Context } from '../../types'

// function

const main = (ctx: Context) => {
  const { content } = ctx
  const setFn = new Set<string>()

  content.list.forEach(it => {
    if (!it.is('function')) return
    setFn.add(it.value)
  })

  return setFn
}

// export
export default main
