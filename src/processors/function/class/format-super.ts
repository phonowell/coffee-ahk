import Item from '../../../models/Item.js'

import type { Context } from '../../../types/index.js'

const isOpener = (it: Item): boolean =>
  (it.type === 'edge' && it.value.endsWith('-start')) ||
  (it.type === 'bracket' && (it.value === '(' || it.value === '[' || it.value === '{'))

const isCloser = (it: Item): boolean =>
  (it.type === 'edge' && it.value.endsWith('-end')) ||
  (it.type === 'bracket' && (it.value === ')' || it.value === ']' || it.value === '}'))

/**
 * Find the enclosing method's name for `super` — CoffeeScript `super()` calls
 * the parent method of the same name, not always the constructor.
 * Method definitions look like `property ':' parameter-start|block-start`;
 * deeper groups (object literals, nested functions) are skipped via depth.
 */
const findMethodName = (ctx: Context, i: number): string => {
  const { content } = ctx

  let depth = 0
  for (let j = i - 1; j >= 0; j--) {
    const it = content.at(j)
    if (!it) break
    if (isCloser(it)) {
      depth++
      continue
    }
    if (isOpener(it)) {
      if (depth > 0) depth--
      continue
    }
    if (depth > 0) continue
    // Methods arrive as `property '=' function parameter-start` after the
    // class formatter rewrites `name: ->` into an assignment shape
    if (it.type !== 'property' || !content.at(j + 1)?.is('sign', '=')) continue
    if (
      content.at(j + 2)?.type === 'function' &&
      content.at(j + 3)?.is('edge', 'parameter-start')
    ) {
      return it.value
    }
  }
  return ''
}

export const formatSuper = (ctx: Context) => {
  const { content } = ctx

  const listContent: Item[] = []
  content.toArray().forEach((item, i) => {
    listContent.push(item)
    if (!item.is('super')) return

    const next = content.at(i + 1)
    if (!next?.is('edge', 'call-start')) return

    const name = findMethodName(ctx, i) || 'constructor'
    const method = name === 'constructor' ? '__New' : name
    const scope2 = next.scope.toArray()

    listContent.push(
      new Item({ type: '.', value: '.', scope: scope2 }),
      new Item({ type: 'property', value: method, scope: scope2 }),
    )
  })

  content.reload(listContent)
}
