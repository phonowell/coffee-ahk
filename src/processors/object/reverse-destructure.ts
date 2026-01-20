// Reverse destructuring functionality
import Item from '../../models/Item.js'

import type { Context } from '../../types'

// Helper function to collect variables from object shorthand syntax
const collectVariables = (
  content: Context['content'],
  startIndex: number,
): string[] | null => {
  const variables: string[] = []
  let checkIndex = startIndex
  let currentItem = content.at(checkIndex)

  if (!currentItem?.is('identifier')) return null
  variables.push(currentItem.value)
  checkIndex++

  // Collect all identifiers separated by commas
  while (checkIndex < content.length) {
    currentItem = content.at(checkIndex)
    if (!currentItem) return null
    if (currentItem.is('bracket', '}')) break

    if (currentItem.is('sign', ',')) {
      checkIndex++
      const nextVar = content.at(checkIndex)
      if (!nextVar?.is('identifier')) return null
      variables.push(nextVar.value)
      checkIndex++
    } else return null // Invalid pattern
  }

  return variables
}

// Handle reverse destructuring: d = { points } -> d = {points: points}
export const reverseDeconstruct = (ctx: Context) => {
  const { content } = ctx
  const ranges: Array<{ start: number; end: number }> = []

  content.toArray().forEach((item, i) => {
    // Look for pattern: identifier = { identifier }
    if (!item.is('sign', '=')) return

    const next = content.at(i + 1)
    if (!next?.is('bracket', '{')) return

    // Collect variables from the shorthand syntax
    const variables = collectVariables(content, i + 2)
    if (!variables) return

    // Find the closing brace position
    let braceIndex = i + 2
    let braceItem = content.at(braceIndex)
    while (braceItem && !braceItem.is('bracket', '}')) {
      braceIndex++
      braceItem = content.at(braceIndex)
    }

    // Check if this is a simple variable reference
    const afterBrace = content.at(braceIndex + 1)
    if (afterBrace && !afterBrace.is('new-line') && !afterBrace.is('edge'))
      return

    ranges.push({ start: i + 2, end: braceIndex })
  })
  const listContent: Item[] = []

  content.toArray().forEach((item, i) => {
    listContent.push(item)

    if (!ranges.some((range) => i >= range.start && i < range.end)) return
    if (!item.is('identifier')) return

    const prev = content.at(i - 1)
    if (!prev) return
    if (!(prev.is('bracket', '{') || prev.is('sign', ','))) return

    const next = content.at(i + 1)
    if (!next) return
    if (!(next.is('bracket', '}') || next.is('sign', ','))) return

    const scope = item.scope.toArray()
    listContent.push(
      new Item({ type: 'sign', value: ':', scope }),
      new Item({ type: 'identifier', value: item.value, scope }),
    )
  })

  content.reload(listContent)
}
