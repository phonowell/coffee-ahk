// Arrow function handling
import { THIS } from '../../constants.js'
import Item from '../../models/Item.js'

import type { ScopeType } from '../../models/ScopeType'
import type { Context } from '../../types'

const findEdge = (ctx: Context, i: number = ctx.content.length - 1): number => {
  const { content } = ctx

  const it = content.at(i)
  if (!it) return 0

  if (it.is('edge', 'parameter-start')) return i
  return findEdge(ctx, i - 1)
}

export const arrow = (ctx: Context, type: string) => {
  const { content, scope, token, warnings } = ctx

  // Warn about => outside class context
  if (type === '=>' && !scope.includes('class')) {
    const line = token[2].first_line + 1
    warnings.push(
      `line ${line}: '=>' outside class has no meaningful 'this' binding in AHK`,
    )
  }

  // Mark do => with fat arrow marker so do processor knows to pass this
  if (type === '=>') {
    // Search backwards for __mark:do__ (might not be at -1)
    for (let i = content.length - 1; i >= 0; i--) {
      const it = content.at(i)
      if (it?.is('native', '__mark:do__')) {
        // Mutate the item directly (content.toArray() returns a copy)
        it.value = '__mark:do-fat__'
        break
      }
      // Stop if we hit a newline or other structural element
      if (it?.is('new-line') || it?.is('edge')) break
    }
  }

  // Check if this is a class method definition (scope ends with 'class' or 'parameter'+'class')
  // Class methods are handled by prepend-this.ts processor
  const isClassMethod =
    scope.at(-1) === 'class' ||
    (scope.at(-1) === 'parameter' && scope.at(-2) === 'class')

  // fn = -> xxx
  if (!content.at(-1)?.is('edge', 'parameter-end')) {
    if (!content.at(-2)?.is('property', 'constructor'))
      content.push({ type: 'identifier', value: 'anonymous' })

    scope.push('parameter')

    // Use ℓthis parameter for => outside class method definitions
    if (type === '=>' && !isClassMethod) {
      content.push(
        { type: 'edge', value: 'parameter-start' },
        { type: 'identifier', value: THIS },
        { type: 'edge', value: 'parameter-end' },
      )
    } else {
      content.push(
        { type: 'edge', value: 'parameter-start' },
        { type: 'edge', value: 'parameter-end' },
      )
    }
    scope.pop()
  } else if (type === '=>' && !isClassMethod) {
    // Use ℓthis parameter for => outside class method definitions
    const scp2: ScopeType[] = [...scope.toArray(), 'parameter']
    content.splice(
      findEdge(ctx) + 1,
      0,
      new Item({ type: 'identifier', value: THIS, scope: scp2 }),
      new Item({ type: 'sign', value: ',', scope: scp2 }),
    )
  }

  scope.push('function')
  return true
}
