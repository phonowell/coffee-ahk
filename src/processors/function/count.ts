import type { Context } from '../../types'

const main = (ctx: Context) => {
  const { content } = ctx
  const setFn = new Set<string>()

  content.toArray().forEach((it) => {
    if (!it.is('function')) return
    setFn.add(it.value)
  })

  return setFn
}

export default main
