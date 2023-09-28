import { Context } from '../../types'

// function

const main = (ctx: Context) => {
  const { content } = ctx
  content.list.forEach(item => {
    if (item.type !== 'await') return void 0
  })
}

// export
export default main
