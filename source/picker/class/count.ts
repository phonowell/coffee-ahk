import { Context } from '../../types'

// function

const main = (ctx: Context) => {
  const { content } = ctx
  const setClass = new Set<string>()

  content.list.forEach((item, i) => {
    if (item.type !== 'class') return

    const it = content.eq(i + 1)
    if (!it) throw new Error('Unexpected error: picker/class/count/1')

    if (it.type !== 'identifier') return
    setClass.add(it.value)
  })

  return setClass
}

// export
export default main
