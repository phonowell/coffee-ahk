import data from '../../../data/forbidden.json'

import type { Context } from '../../types'

const listForbidden = data
  .filter((item): item is string => typeof item === 'string')
  .map((item) => item.toLowerCase())

const isVariableForbidden = (name: string): boolean => {
  const v = name.toLowerCase()
  return v.startsWith('a_') || listForbidden.includes(v)
}

const checkSimpleAssignment = (ctx: Context, i: number): void => {
  const { content } = ctx
  const item = content.at(i)
  const next = content.at(i + 1)

  if (!item?.is('identifier') || !next?.is('sign', '=')) return

  if (isVariableForbidden(item.value)) {
    throw new Error(
      `ahk/forbidden: variable name '${item.value}' is not allowed`,
    )
  }
}

const checkDestructuringAssignment = (ctx: Context, i: number): void => {
  const { content } = ctx
  const item = content.at(i)
  const prev = content.at(i - 1)

  if (!item?.is('identifier')) return

  // 检查是否在数组解构中: [identifier, ...] = ...
  if (!(prev?.is('sign', ',') || prev?.is('bracket', '['))) return

  // 简单检查：向前查找是否有 ] = 模式
  for (let j = i + 1; j < Math.min(i + 10, content.list.length); j++) {
    const current = content.at(j)
    const nextItem = content.at(j + 1)

    if (current?.is('bracket', ']') && nextItem?.is('sign', '=')) {
      if (isVariableForbidden(item.value)) {
        throw new Error(
          `ahk/forbidden: variable name '${item.value}' is not allowed`,
        )
      }
      break
    }
  }
}

const checkFunctionParameters = (ctx: Context, i: number): void => {
  const { content } = ctx
  const item = content.at(i)
  const prev = content.at(i - 1)

  if (!item?.is('identifier')) return

  // 检查是否在函数参数列表中
  // 参数要么在 parameter-start 后面，要么在逗号后面（在参数列表内）
  const isAfterParameterStart = prev?.is('edge', 'parameter-start')
  const isAfterCommaInParameters =
    prev?.is('sign', ',') &&
    (() => {
      // 向前查找最近的 edge 标记
      for (let j = i - 2; j >= Math.max(0, i - 10); j--) {
        const edge = content.at(j)
        if (edge?.is('edge', 'parameter-start')) return true
        if (edge?.is('edge', 'parameter-end')) return false
      }
      return false
    })()

  if (isAfterParameterStart || isAfterCommaInParameters) {
    if (isVariableForbidden(item.value)) {
      throw new Error(
        `ahk/forbidden: parameter name '${item.value}' is not allowed`,
      )
    }
  }
}

const main = (ctx: Context) => {
  const { content } = ctx

  content.list.forEach((_, i) => {
    checkSimpleAssignment(ctx, i)
    checkDestructuringAssignment(ctx, i)
    checkFunctionParameters(ctx, i)
  })
}

export default main
