/**
 * Bind transformation for ctx-transform
 *
 * Adds .Bind() after Func() calls - .Bind(λ) inside functions, .Bind({}) at top level.
 */
import { CTX } from '../../../constants.js'
import Item from '../../../models/Item.js'

import type { ScopeType } from '../../../models/ScopeType.js'
import type { Context } from '../../../types'

/** Add .Bind() after Func() calls - .Bind(λ) inside functions, .Bind({}) at top level */
export const addBind = (ctx: Context) => {
  const { content } = ctx
  const out: Item[] = []

  for (let i = 0; i < content.length; i++) {
    const item = content.at(i)
    if (!item) continue
    out.push(item)

    if (!item.is('edge', 'call-end')) continue

    const prev1 = content.at(i - 1)
    const prev2 = content.at(i - 2)
    const prev3 = content.at(i - 3)

    if (prev1?.type !== 'string') continue
    if (!prev2?.is('edge', 'call-start')) continue
    if (!prev3?.is('identifier', 'Func')) continue

    // Already has .Bind?
    const next = content.at(i + 1)
    if (next?.is('.', '.') && content.at(i + 2)?.is('identifier', 'Bind'))
      continue

    const scope = item.scope.toArray()
    const inFunction = item.scope.includes('function')
    const callScope = [...scope, 'call'] as ScopeType[]

    out.push(new Item({ type: '.', value: '.', scope }))
    out.push(new Item({ type: 'identifier', value: 'Bind', scope }))
    out.push(new Item({ type: 'edge', value: 'call-start', scope: callScope }))

    if (inFunction) {
      // Inside function: bind to current closure context λ
      out.push(new Item({ type: 'identifier', value: CTX, scope: callScope }))
    } else {
      // Top level: bind to empty object {}
      out.push(
        new Item({ type: 'edge', value: 'object-start', scope: callScope }),
      )
      out.push(
        new Item({ type: 'edge', value: 'object-end', scope: callScope }),
      )
    }

    out.push(new Item({ type: 'edge', value: 'call-end', scope: callScope }))
  }

  content.reload(out)
}
