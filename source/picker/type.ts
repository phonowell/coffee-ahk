import { Context } from '../entry/type'
import Item from '../module/Item'

// variable

const mapVariable: Map<string, string> = new Map()

// function

const catchFunction = (
  item: Item
): void => {

  const name = item.value

  const lastType = getLastType(name, 'function')
  if (!lastType) return

  if (lastType !== 'function') throw new Error(`type error: '${name}' should be a 'function', but is incorrectly set to '${lastType}'`)
}

const catchIdentifier = (
  ctx: Context,
  item: Item,
  i: number
): void => {

  const { content } = ctx
  const name = item.value

  const next = content.eq(i + 1)
  if (!Item.equal(next, 'sign', '=')) return

  const next2 = content.eq(i + 2)
  const type = getType(next2)

  if (type === 'unknown') return

  const lastType = getLastType(name, type)
  if (!lastType) return

  if (type !== lastType) throw new Error(`type error: '${name}' should be a(n) '${lastType}', but is incorrectly set to '${type}'`)
}

const getType = (
  item: Item
): string => {

  if (item.type === 'boolean') return 'boolean'
  if (item.type === 'number') return 'number'

  if (item.type === 'string') return item.value !== '""'
    ? 'string'
    : 'unknown'

  if (item.type === 'edge' && item.value === 'array-start') return 'array'

  if (item.type === 'bracket' && item.value === '{') return 'object'

  if (item.type === 'identifier' && item.value === 'Func') return 'function'

  return 'unknown'
}

const getLastType = (
  name: string,
  type: string
): string => {

  const lastType = mapVariable.get(name)
  if (lastType) return lastType

  mapVariable.set(name, type)
  return ''
}

const main = (
  ctx: Context
): void => {

  const { content } = ctx

  mapVariable.clear()

  // each
  content.list.forEach((item, i) => {

    if (!['function', 'identifier'].includes(item.type)) return

    if (item.type === 'function') {
      catchFunction(item)
      return
    }

    catchIdentifier(ctx, item, i)
  })
}

// export
export default main