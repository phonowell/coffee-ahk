import { Context } from '../type'
import Item from '../module/item'

// interface

type Variable = {
  isGlobal: boolean
  type: string
}

// variable

const mapVariable: Map<string, Variable> = new Map()

// function

function catchFunction(
  item: Item
): void {

  const { isGlobal, name } = getName(item.value)

  const last = getVariable(name, isGlobal, 'function')
  if (!last) return

  if (last.type !== 'function')
    throw new Error(`type error: '${name}' should be a 'function', but is incorrectly set to '${last.type}'`)
}

function catchIdentifier(
  ctx: Context,
  item: Item,
  i: number
): void {

  const { content } = ctx
  const { isGlobal, name } = getName(item.value)

  const next = content.eq(i + 1)
  if (!Item.equal(next, 'sign', '=')) return

  const next2 = content.eq(i + 2)
  const type = getType(next2)

  if (type === 'unknown') return

  const last = getVariable(name, isGlobal, type)
  if (!last) return

  if (last.isGlobal && last.type !== type)
    throw new Error(`type error: '${name}' should be a(n) '${last.type}', but is incorrectly set to '${type}'`)
}

function getName(
  value: string
): {
  isGlobal: boolean
  name: string
} {

  const list = value.split(' ')
  const isGlobal = list.length !== 1
  const name = list[list.length - 1]
  return { isGlobal, name }
}

function getType(
  item: Item
): string {

  if (item.type === 'boolean') return 'boolean'
  if (item.type === 'number') return 'number'
  if (item.type === 'string') return 'string'
  if (item.type === 'edge' && item.value === 'array-start') return 'array'
  if (item.type === 'bracket' && item.value === '{') return 'object'
  if (item.type === 'identifier' && item.value === 'Func') return 'function'
  return 'unknown'
}

function getVariable(
  name: string,
  isGlobal: boolean,
  type: string
): Variable | null {
  const last = mapVariable.get(name)
  if (last) return last

  mapVariable.set(name, { isGlobal, type })
  return null
}

function main(
  ctx: Context
): void {

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

  // console.log(mapVariable)
}

// export
export default main
