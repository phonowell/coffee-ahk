import { Context } from '../../types'

// function

const main = (ctx: Context) => {
  const { content } = ctx

  content.list.forEach((item, i) => {
    if (!item.is('edge', 'parameter-start')) return

    const prev = content.at(i - 1)
    if (!prev?.is('identifier')) return

    prev.type = 'function'
  })
}

// export
export default main
