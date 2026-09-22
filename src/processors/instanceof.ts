// Instanceof processor: converts identifier after instanceof-class marker to string
import Item from '../models/Item.js'
import { ErrorType, TranspileError } from '../utils/error.js'
import { toFullWidth } from '../utils/full-width.js'

import type { Context } from '../types/index.js'

const main = (ctx: Context) => {
  const { content } = ctx
  const listContent: Item[] = []

  // Index up to which items were consumed by a qualified class name (a.b.C)
  let skipUntil = -1

  content.toArray().forEach((item, i) => {
    if (i < skipUntil) return

    // Skip marker
    if (item.is('edge', 'instanceof-class')) {
      // Non-name RHS ((expr), call, index) can't be a static class name —
      // silently emitting `x.__Class == (Foo)` compares string to object
      const nx = content.at(i + 1)
      if (nx && nx.type !== 'identifier' && nx.type !== 'this') {
        throw new TranspileError(
          ctx,
          ErrorType.UNSUPPORTED,
          `'instanceof' requires a class name, got '${nx.value}'`,
          `Use a plain class name like 'obj instanceof Foo'`,
        )
      }
      return
    }

    // Convert identifier after marker to string literal
    const prev = content.at(i - 1)
    if (
      prev?.is('edge', 'instanceof-class') &&
      (item.type === 'identifier' || item.type === 'this')
    ) {
      // Qualified name a.b.C / this.C: consume the whole chain, keep the final
      // segment — AHK class names are flat, so `ns.C` refers to class `C`
      let name = item.type === 'identifier' ? item.value : ''
      let j = i + 1
      while (
        content.at(j)?.is('.') &&
        ['identifier', 'property'].includes(content.at(j + 1)?.type ?? '')
      ) {
        name = content.at(j + 1)?.value ?? name
        j += 2
      }
      skipUntil = j

      if (!name) {
        throw new TranspileError(
          ctx,
          ErrorType.UNSUPPORTED,
          `'instanceof' requires a class name, got '${item.value}'`,
          `Use a plain class name like 'obj instanceof Foo'`,
        )
      }

      const next = content.at(skipUntil)
      if (next?.is('edge', 'call-start') || next?.is('edge', 'index-start')) {
        throw new TranspileError(
          ctx,
          ErrorType.UNSUPPORTED,
          `'instanceof' does not support call/index expressions on the right side`,
          `Assign the expression to a class name variable first`,
        )
      }

      // __Class holds the full-width rendered name; the comparison string must match
      const className = ctx.cache.classNames.has(name) ? toFullWidth(name) : name
      listContent.push(
        new Item({
          type: 'string',
          value: `"${className}"`,
          scope: item.scope,
        }),
      )
      return
    }

    listContent.push(item)
  })

  content.reload(listContent)
}

export default main
