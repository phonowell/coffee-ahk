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
  while (checkIndex < content.list.length) {
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
  const listContent: Item[] = []

  content.list.forEach((item, i) => {
    listContent.push(item)

    // Look for pattern: identifier = { identifier }
    if (!item.is('sign', '=')) return

    const next = content.at(i + 1)
    if (!next?.is('bracket', '{')) return

    // Collect variables from the shorthand syntax
    const variables = collectVariables(content, i + 2)
    if (!variables) return

    // Find the closing brace position
    let braceIndex = i + 2
    while (
      content.at(braceIndex) &&
      !content.at(braceIndex)?.is('bracket', '}')
    )
      braceIndex++

    // Check if this is a simple variable reference
    const afterBrace = content.at(braceIndex + 1)
    if (afterBrace && !afterBrace.is('new-line') && !afterBrace.is('edge'))
      return

    // Insert colon and duplicate identifier for each variable
    const firstVar = content.at(i + 2)
    if (!firstVar) return

    variables.forEach((variable, index) => {
      if (index > 0)
        listContent.push(new Item('sign', ',', firstVar.scope.list))

      listContent.push(
        new Item('sign', ':', firstVar.scope.list),
        new Item('identifier', variable, firstVar.scope.list),
      )
    })
  })

  content.reload(listContent)
}
