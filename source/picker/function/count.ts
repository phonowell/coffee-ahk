import { Context } from '@/entry/type'

// function

const main = (ctx: Context) => {
  const { content } = ctx
  const setFn = new Set<string>()

  content.list.forEach(item => {
    if (item.type !== 'function') return
    setFn.add(item.value)
  })

  return setFn
}

// export
export default main
