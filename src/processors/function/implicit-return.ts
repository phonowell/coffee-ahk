import Item from '../../models/Item.js'

import { findFnStart } from './implicit-return/find-fn-start.js'
import { ignore } from './implicit-return/ignore.js'
import { pickItems } from './implicit-return/pick-items.js'

import { createTranspileError, ErrorType } from '../../utils/error.js'

import type Scope from '../../models/Scope.js'
import type { Context } from '../../types/index.js'

type Pending = { scope: Scope; isObjectWithoutBrackets: boolean }

const isOpenerItem = (it: Item): boolean =>
  (it.type === 'edge' && it.value.endsWith('-start')) ||
  (it.type === 'bracket' && (it.value === '(' || it.value === '[' || it.value === '{'))

const isCloserItem = (it: Item): boolean =>
  (it.type === 'edge' && it.value.endsWith('-end')) ||
  (it.type === 'bracket' && (it.value === ')' || it.value === ']' || it.value === '}'))

const main = (ctx: Context) => {
  const { content } = ctx

  // Multiple functions may nest (e.g. a default-param `->` inside an outer
  // parameter list) — track each pending return insertion independently
  const pending = new Map<number, Pending>()

  const listContent: Item[] = []
  content.toArray().forEach((item, i) => {
    listContent.push(item)

    const p = pending.get(i)
    if (p) {
      pending.delete(i)
      if (p.isObjectWithoutBrackets) {
        listContent.push(
          new Item({
            type: 'new-line',
            value: p.scope.length.toString(),
            scope: p.scope,
          }),
        )
      }
      listContent.push(new Item({ type: 'statement', value: 'return', scope: p.scope }))
      return
    }

    if (!item.is('edge', 'parameter-start')) return
    if (content.at(i - 1)?.is('property', '__New')) return

    const [iStart, scpStart] = findFnStart(ctx, i)
    const list = pickItems(ctx, {
      i: iStart,
      list: [],
      scope: scpStart,
    })

    const item1 = list.at(1)
    const isObjectWithoutBrackets = item1?.is('bracket', '{') ?? false

    if (
      list.filter((it) => it.is('new-line') && it.scope.isEqual(scpStart)).length >
      (isObjectWithoutBrackets ? 1 : 2)
    )
      return

    // A `class` in tail position produces `return class {` — invalid AHK.
    // Only checked once implicit return would actually inject (single-statement
    // bodies); a class as the last statement of a longer body is legal.
    // Scan backward past the function's own block-end, tracking depth so the
    // class body's own block doesn't hide the `class` keyword.
    let k = list.length - 1
    if (list.at(k)?.is('edge', 'block-end')) k--
    while (list.at(k)?.is('new-line')) k--
    let depth = 0
    let head: Item | undefined
    for (; k >= 0; k--) {
      const it = list.at(k)
      if (!it) break
      if (isCloserItem(it)) {
        depth++
        continue
      }
      if (isOpenerItem(it)) {
        if (depth > 0) depth--
        else if (it.is('edge', 'block-start')) break
        continue
      }
      if (depth > 0 || it.is('new-line')) {
        if (depth === 0 && head) break
        continue
      }
      head = it
    }
    if (head?.type === 'class') {
      throw createTranspileError(
        ErrorType.UNSUPPORTED,
        `a 'class' block in tail position can't produce a return value`,
        `Declare the class at statement level, or assign a name and return it`,
      )
    }
    const item2 = list.at(2)
    if (item2 && ignore(item2)) return

    pending.set(iStart + (isObjectWithoutBrackets ? 0 : 1), {
      scope: scpStart,
      isObjectWithoutBrackets,
    })
  })

  content.reload(listContent)
}

export default main
