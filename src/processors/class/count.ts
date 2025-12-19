import { TranspileError } from '../../utils/error.js'

import type { Context } from '../../types'

const main = (ctx: Context) => {
  const { content } = ctx
  const setClass = new Set<string>()

  content.toArray().forEach((item, i) => {
    if (item.type !== 'class') return

    const it = content.at(i + 1)
    if (!it) {
      throw new TranspileError(
        ctx,
        'internal',
        `class/count: missing identifier after class keyword`,
      )
    }

    if (it.type !== 'identifier') return
    setClass.add(it.value)
  })

  return setClass
}

export default main
