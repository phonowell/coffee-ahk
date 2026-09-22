import Item from '../../models/Item.js'
import Scope from '../../models/Scope.js'

import type { ScopeType } from '../../models/ScopeType.js'
import type { Context } from '../../types/index.js'

/**
 * `do (a, b = 2) ->` invokes the function with the outer `a` and the default
 * expression `2` — find the extracted function's parameter list and rebuild
 * the matching call arguments.
 */
const collectDoArgs = (snapshot: Item[], listContent: Item[], scope: ScopeType[]): Item[] => {
  // The function reference `Func` + call-start + "name" + call-end precedes
  // the call boundary — extract the name from the string item
  let fnName = ''
  for (let j = listContent.length - 1; j >= 3; j--) {
    if (listContent.at(j)?.is('edge', 'call-end') !== true) continue
    const str = listContent.at(j - 1)
    const open = listContent.at(j - 2)
    const func = listContent.at(j - 3)
    if (
      str?.type === 'string' &&
      open?.is('edge', 'call-start') === true &&
      func?.is('identifier', 'Func') === true
    ) {
      fnName = str.value.replace(/^"|"$/g, '')
      break
    }
  }
  if (!fnName) return []

  // Locate the extracted definition: `name` followed by parameter-start
  // (the definition head is 'function'- or 'identifier'-typed)
  for (let j = 0; j < snapshot.length; j++) {
    const it = snapshot.at(j)
    if (it?.value !== fnName) continue
    if (snapshot.at(j + 1)?.is('edge', 'parameter-start') !== true) continue

    const args: Item[] = []
    let segment: Item[] = []
    const flush = () => {
      // `a` → outer `a`; `b = expr` → `expr`; internals (λ/ℓ*) are skipped
      const name = segment.find((p) => p.type === 'identifier')
      if (!name || name.value === 'λ' || name.value.startsWith('ℓ')) {
        segment = []
        return
      }
      const eq = segment.findIndex((p) => p.is('sign', '='))
      const argItems = eq === -1 ? [name] : segment.slice(eq + 1)
      if (!argItems.length) {
        segment = []
        return
      }
      if (args.length) {
        const comma = argItems.at(0)!.clone()
        comma.type = 'sign'
        comma.value = ','
        args.push(comma)
      }
      for (const p of argItems) {
        const arg = p.clone()
        arg.scope = new Scope(scope)
        args.push(arg)
      }
      segment = []
    }

    // Commas nested inside a default expression (`b = f(1, 2)`, `b = [x, y]`)
    // belong to that expression — only depth-0 commas split parameters
    let innerDepth = 0
    for (let k = j + 2; k < snapshot.length; k++) {
      const p = snapshot.at(k)
      if (!p) break
      if (innerDepth === 0 && p.is('edge', 'parameter-end') === true) break
      if (
        (p.type === 'edge' && p.value.endsWith('-start')) ||
        (p.type === 'bracket' && (p.value === '(' || p.value === '[' || p.value === '{'))
      ) {
        innerDepth++
        segment.push(p)
        continue
      }
      if (
        (p.type === 'edge' && p.value.endsWith('-end')) ||
        (p.type === 'bracket' && (p.value === ')' || p.value === ']' || p.value === '}'))
      ) {
        innerDepth--
        segment.push(p)
        continue
      }
      if (innerDepth === 0 && p.is('sign', ',')) {
        flush()
        continue
      }
      segment.push(p)
    }
    flush()
    return args
  }
  return []
}

const main = (ctx: Context) => {
  const { content } = ctx
  const snapshot = content.toArray()

  let flag = false
  let isFatArrow = false
  // Depth of groups opened *inside* the do expression; a closer at depth 0
  // belongs to an outer construct (e.g. the call wrapping `f(x, do -> y)`)
  let depth = 0

  const listContent: Item[] = []
  content.toArray().forEach((item) => {
    if (flag) {
      const isOpener = item.type === 'edge' && item.value.endsWith('-start')
      const isCloser = item.type === 'edge' && item.value.endsWith('-end')

      const isBoundary =
        item.is('new-line') ||
        item.is('bracket', '}') ||
        item.is('bracket', ')') ||
        item.is('sign', ',') ||
        (isCloser && depth === 0)

      if (isBoundary) {
        flag = false
        depth = 0
        const scope2: ScopeType[] = [...item.scope.toArray(), 'call']
        listContent.push(
          // add `()` for type-checking
          new Item({ type: 'bracket', value: ')', scope: item.scope }),
          new Item({ type: 'edge', value: 'call-start', scope: scope2 }),
        )
        // Pass this if fat arrow (=>) function
        if (isFatArrow) {
          listContent.push(new Item({ type: 'this', value: 'this', scope: scope2 }))
        }
        // `do (a, b = 2) ->` passes outer values / default expressions
        const callArgs = collectDoArgs(snapshot, listContent, scope2)
        if (callArgs.length) {
          if (isFatArrow) {
            const comma = callArgs.at(0)!.clone()
            comma.type = 'sign'
            comma.value = ','
            listContent.push(comma)
          }
          listContent.push(...callArgs)
        }

        listContent.push(new Item({ type: 'edge', value: 'call-end', scope: scope2 }), item)
        isFatArrow = false
        return
      }

      if (isOpener) depth++
      else if (isCloser) depth--

      listContent.push(item)
      return
    }

    // Check for do marker (thin or fat arrow)
    const isDoThin = item.is('native', '__mark:do__')
    const isDoFat = item.is('native', '__mark:do-fat__')

    if (!isDoThin && !isDoFat) {
      listContent.push(item)
      return
    }

    flag = true
    depth = 0
    isFatArrow = isDoFat

    // add `()` for type-checking
    listContent.push(new Item({ type: 'bracket', value: '(', scope: item.scope }))
  })

  content.reload(listContent)
}

export default main
