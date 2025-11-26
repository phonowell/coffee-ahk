import type { Context } from '../../types'

const main = (ctx: Context) => {
  const { content } = ctx
  const setClass = new Set<string>()

  content.toArray().forEach((item, i) => {
    if (item.type !== 'class') return

    const it = content.at(i + 1)
    if (!it) {
      throw new Error(
        `ahk/internal: class/count: missing identifier after class keyword (token index ${i})`,
      )
    }

    if (it.type !== 'identifier') return
    setClass.add(it.value)
  })

  return setClass
}

export default main
