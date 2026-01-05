/**
 * Convert inline if-then-else expressions to ternary operators.
 * Transforms: a := if b then c else d → a := b ? c : d
 *
 * Pattern to match:
 * 1. Find 'if' item
 * 2. Check if it's in expression context (after := or = assignment)
 * 3. Extract condition, then-branch, and else-branch
 * 4. Convert to ternary: condition ? then : else
 */
import { ErrorType, TranspileError } from '../utils/error.js'
/**
 * Note: In processor stage, INDENT/OUTDENT tokens have been converted to edges:
 * - INDENT → new-line + block-start edge
 * - OUTDENT → new-line + block-end edge
 */

import type Item from '../models/Item.js'
import type { Context } from '../types'

export default (ctx: Context): void => {
  const { content } = ctx

  for (let i = 0; i < content.length; i++) {
    const item = content.at(i)
    if (item?.type !== 'if' || item.value !== 'if') continue

    // Check if this is in an expression context (after assignment)
    let hasAssignment = false
    for (let j = i - 1; j >= 0; j--) {
      const prev = content.at(j)
      if (!prev) break

      if (prev.type === 'sign' && (prev.value === ':=' || prev.value === '=')) {
        hasAssignment = true
        break
      }

      // Stop at statement boundaries
      if (prev.type === 'new-line') break
    }

    if (!hasAssignment) continue

    // Find expression-start edge (marks start of condition)
    let conditionStart = -1
    for (let j = i + 1; j < content.length; j++) {
      const next = content.at(j)
      if (!next) break
      if (next.type === 'edge' && next.value === 'expression-start') {
        conditionStart = j + 1
        break
      }
    }

    if (conditionStart === -1) continue

    // Find expression-end edge (marks end of condition)
    let conditionEnd = -1
    for (let j = conditionStart; j < content.length; j++) {
      const next = content.at(j)
      if (!next) break
      if (next.type === 'edge' && next.value === 'expression-end') {
        conditionEnd = j
        break
      }
    }

    if (conditionEnd === -1) continue

    // Find block-start edge after condition (marks start of then-branch)
    let thenStart = -1
    for (let j = conditionEnd + 1; j < content.length; j++) {
      const next = content.at(j)
      if (!next) break
      if (next.type === 'edge' && next.value === 'block-start') {
        thenStart = j + 1
        break
      }
      // Skip new-line
      if (next.type !== 'new-line') break
    }

    if (thenStart === -1) continue

    // Find block-end after then-branch
    let thenEnd = -1
    let blockDepth = 1
    for (let j = thenStart; j < content.length; j++) {
      const next = content.at(j)
      if (!next) break
      if (next.type === 'edge') {
        if (next.value === 'block-start') blockDepth++
        else if (next.value === 'block-end') {
          blockDepth--
          if (blockDepth === 0) {
            thenEnd = j
            break
          }
        }
      }
    }

    if (thenEnd === -1) continue

    // Find 'else' keyword after then block
    let elseIndex = -1
    for (let j = thenEnd + 1; j < content.length; j++) {
      const next = content.at(j)
      if (!next) break
      if (next.type === 'if' && next.value === 'else') {
        elseIndex = j
        break
      }
      // Skip new-line
      if (next.type !== 'new-line') break
    }

    if (elseIndex === -1) continue

    // Find block-start after else (marks start of else-branch)
    let elseStart = -1
    for (let j = elseIndex + 1; j < content.length; j++) {
      const next = content.at(j)
      if (!next) break
      if (next.type === 'edge' && next.value === 'block-start') {
        elseStart = j + 1
        break
      }
      // Skip new-line
      if (next.type !== 'new-line') break
    }

    if (elseStart === -1) continue

    // Find block-end after else-branch
    let elseEnd = -1
    blockDepth = 1
    for (let j = elseStart; j < content.length; j++) {
      const next = content.at(j)
      if (!next) break
      if (next.type === 'edge') {
        if (next.value === 'block-start') blockDepth++
        else if (next.value === 'block-end') {
          blockDepth--
          if (blockDepth === 0) {
            elseEnd = j
            break
          }
        }
      }
    }

    if (elseEnd === -1) continue

    // Extract parts (exclude the edges and new-lines)
    const condition = content.slice(conditionStart, conditionEnd)
    const thenBranch = content.slice(thenStart, thenEnd)
    const elseBranch = content.slice(elseStart, elseEnd)

    // Check for nested if expressions (not supported)
    const hasNestedIf = (branch: Item[]): boolean =>
      branch.some((item) => item.type === 'if' && item.value === 'if')

    if (hasNestedIf(thenBranch) || hasNestedIf(elseBranch)) {
      throw new TranspileError(
        ctx,
        ErrorType.UNSUPPORTED,
        `Nested if-then-else expressions are not supported`,
        `Use temporary variables: temp = if inner then a else b; result = if outer then temp else c` +
          `Workaround 2 - Use IIFE with early return:\n` +
          `  result = do ->\n` +
          `    if condition1 then return x\n` +
          `    if condition2 then return y\n` +
          `    z`,
      )
    }

    // Filter out new-line items from branches
    const cleanThenBranch = thenBranch.filter(
      (item) => item.type !== 'new-line',
    )
    const cleanElseBranch = elseBranch.filter(
      (item) => item.type !== 'new-line',
    )

    if (
      condition.length === 0 ||
      cleanThenBranch.length === 0 ||
      cleanElseBranch.length === 0
    )
      continue

    // Create ternary operators
    const first = condition[0]
    if (!first) continue

    const questionMark = first.clone()
    questionMark.type = 'sign'
    questionMark.value = '?'

    const colon = first.clone()
    colon.type = 'sign'
    colon.value = ':'

    // Build ternary: condition ? then : else
    const ternary: Item[] = [
      ...condition,
      questionMark,
      ...cleanThenBranch,
      colon,
      ...cleanElseBranch,
    ]

    // Calculate the full range to replace: from 'if' to final block-end
    const replaceStart = i
    const replaceEnd = elseEnd + 1

    // Remove old items and insert ternary
    content.splice(replaceStart, replaceEnd - replaceStart, ...ternary)

    // Adjust index since we modified the content
    i = replaceStart + ternary.length - 1
  }
}
