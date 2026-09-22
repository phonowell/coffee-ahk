import Item from '../../models/Item.js'

import type { Context } from '../../types/index.js'

const main = (ctx: Context) => {
  const { content } = ctx
  const cache = new Set<string>()
  // Inline targets (`x = (b = 1)`, `a = b = 1`) can't carry `global` mid-
  // expression — they get standalone `global v` declarations at file top
  const inlineGlobals = new Set<string>()
  let flagIgnore = 0

  const listContent: Item[] = []

  content.toArray().forEach((item, i) => {
    if (flagIgnore) {
      flagIgnore--
      return
    }

    listContent.push(item)

    if (!item.is('sign', '=')) return

    const prev = content.at(i - 1)
    if (!prev?.is('identifier')) return
    // Top-level assignments inside non-function blocks (if/for/while/try) are
    // still globals in AHK — only function bodies and parameter defaults are excluded
    if (prev.scope.includes('function') || prev.scope.includes('parameter')) return

    // Inline assignment `x = (b = 1)` / chained `a = b = 1`: `global` can't be
    // injected mid-expression, but the target is still a top-level var —
    // register it so closures read it as a bare super-global instead of a
    // broken `λ.b`. Member targets (`a.b =`, `a::b =`) are excluded.
    const before = content.at(i - 2)
    if (i - 2 >= 0 && !before?.is('new-line')) {
      if (before?.is('.') || before?.type === 'prototype') return
      cache.add(prev.value)
      inlineGlobals.add(prev.value)
      return
    }

    if (cache.has(prev.value)) return
    cache.add(prev.value)

    if (content.at(i + 1)?.is('identifier', prev.value) && content.at(i + 2)?.is('new-line')) {
      listContent.splice(listContent.length - 2, 2)
      flagIgnore = 2
      return
    }

    listContent.splice(
      listContent.length - 2,
      0,
      new Item({ type: 'native', value: 'global ', scope: item.scope }),
    )
  })

  if (inlineGlobals.size) {
    const decl: Item[] = []
    for (const v of inlineGlobals) {
      decl.push(
        new Item({ type: 'native', value: 'global ' }),
        new Item({ type: 'identifier', value: v }),
        new Item({ type: 'new-line', value: '0' }),
      )
    }
    listContent.unshift(...decl)
  }

  content.reload(listContent)
  ctx.cache.global = cache
}

export default main
