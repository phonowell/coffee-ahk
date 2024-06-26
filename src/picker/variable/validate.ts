import data from '../../../data/forbidden.json'
import { Context } from '../../types'

// variable

const listForbidden = data.map(item => item.toLowerCase())

// function

const main = (ctx: Context) => {
  const { content } = ctx

  content.list.forEach((item, i) => {
    if (!item.is('identifier')) return
    const next = content.at(i + 1)
    if (!next?.is('sign', '=')) return
    const v = item.value.toLowerCase()
    if (v.startsWith('a_') || listForbidden.includes(v))
      throw new Error(
        `ahk/forbidden: variable name '${item.value}' is not allowed`,
      )
  })
}

// export
export default main
