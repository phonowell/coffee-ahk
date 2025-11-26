import type Content from '../models/Content'
import type Item from '../models/Item'
import type { Context } from '../types'

/**
 * Determines if a token should be removed based on the previous token
 * @returns {boolean} - True if the token should be removed, false otherwise
 * */
const shouldRemoveToken = (
  content: Content,
  item: Item,
  i: number,
): boolean => {
  // Only process new-line tokens
  if (!item.is('new-line')) return false

  const prev = content.at(i - 1)
  if (!prev) return false

  // Remove new-line after opening parenthesis to keep parameters on same line
  if (prev.is('bracket', '(')) return true
  // Remove new-line after assignment operator to keep value on same line
  if (prev.is('sign', '=')) return true

  return false
}

const main = (ctx: Context) => {
  const { content } = ctx
  // Filter out new-line tokens that should be removed and reload content
  content.reload(
    content.toArray().filter((item, i) => !shouldRemoveToken(content, item, i)),
  )
}

export default main
