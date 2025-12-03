/**
 * Convert logical OR (||) operator to ternary expression for default values.
 * Transforms: a := b || 2 → a := b ? b : 2
 *
 * This is necessary because in AHK v1, || returns boolean (0 or 1),
 * not the first truthy value like in JavaScript.
 */

import type Item from '../models/Item.js'
import type { Context } from '../types'

export default (ctx: Context): void => {
  const { content } = ctx

  for (let i = 0; i < content.length; i++) {
    const item = content.at(i)
    if (item?.type !== 'logical-operator' || item.value !== '||') continue

    // Check if this is in an assignment context (not in a condition)
    // Look backward for assignment operator
    let hasAssignment = false
    for (let j = i - 1; j >= 0; j--) {
      const prev = content.at(j)
      if (!prev) break

      if (prev.type === 'sign' && (prev.value === ':=' || prev.value === '=')) {
        hasAssignment = true
        break
      }

      // Stop at statement boundaries
      if (
        prev.type === 'new-line' ||
        prev.type === 'if' ||
        prev.type === 'edge'
      )
        break
    }

    if (!hasAssignment) continue

    // Find the left operand (everything between = and ||)
    let leftStart = -1
    for (let j = i - 1; j >= 0; j--) {
      const prev = content.at(j)
      if (!prev) break
      if (prev.type === 'sign' && (prev.value === ':=' || prev.value === '=')) {
        leftStart = j + 1
        break
      }
    }

    if (leftStart === -1) continue

    // Find the right operand (everything between || and next boundary)
    let rightEnd = content.length
    for (let j = i + 1; j < content.length; j++) {
      const next = content.at(j)
      if (!next) break
      if (
        next.type === 'new-line' ||
        next.type === 'if' ||
        next.type === 'edge' ||
        (next.type === 'sign' && next.value === ',')
      ) {
        rightEnd = j
        break
      }
    }

    // Extract operands
    const leftOperand = content.slice(leftStart, i)
    const rightOperand = content.slice(i + 1, rightEnd)

    if (leftOperand.length === 0 || rightOperand.length === 0) continue

    // Only convert if right operand is a non-boolean literal (number, string, nil)
    // This distinguishes default value patterns (a = b || 2) from boolean logic (a = b || c)
    // Do NOT convert boolean literals (true || false) as they are boolean logic
    const rightFirst = rightOperand[0]
    if (!rightFirst) continue

    // Check for literals: number, string, nil
    // Also handle negative numbers: negative + number
    let isNonBooleanLiteral = ['number', 'string', 'nil'].includes(
      rightFirst.type,
    )

    // Handle negative numbers: -1, -42, etc.
    if (
      !isNonBooleanLiteral &&
      rightFirst.type === 'negative' &&
      rightOperand.length >= 2
    ) {
      const rightSecond = rightOperand[1]
      if (rightSecond?.type === 'number') isNonBooleanLiteral = true
    }

    if (!isNonBooleanLiteral) continue

    // Create ternary operators using clone() for proper scope
    const first = leftOperand[0]
    if (!first) continue

    const questionMark = first.clone()
    questionMark.type = 'sign'
    questionMark.value = '?'

    const colon = first.clone()
    colon.type = 'sign'
    colon.value = ':'

    // Build ternary: left ? left : right
    const ternary: Item[] = [
      ...leftOperand,
      questionMark,
      ...leftOperand.map((item) => item.clone()), // duplicate left operand for the true branch
      colon,
      ...rightOperand,
    ]

    // Remove old items and insert ternary
    content.splice(leftStart, rightEnd - leftStart, ...ternary)

    // Adjust index since we modified the content
    i = leftStart + ternary.length - 1
  }
}
