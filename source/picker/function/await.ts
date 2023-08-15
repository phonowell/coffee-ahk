import { Context } from '../../types'

// function

const main = (ctx: Context): void => {
  const { content } = ctx
  content.list.forEach(item => {
    if (item.type !== 'await') return
  })
}

// export
export default main
