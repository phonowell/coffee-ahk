import { createTranspileError, ErrorType } from '../utils/error.js'

import type { Context } from '../types/index.js'

/**
 * `f(...args)` — AHK v1 spread-call syntax is `args*` (postfix `*`), so the
 * `...` sign must move after its operand. Parameter declarations
 * `(rest...) ->` and postfix calls `f(args...)` already arrive in postfix
 * order and pass through untouched.
 */
const main = (ctx: Context): void => {
  const { content } = ctx

  for (let i = 0; i < content.length; i++) {
    const it = content.at(i)
    if (it?.type !== 'sign' || it.value !== '...') continue

    const next = content.at(i + 1)

    // `(a..., b) ->` — AHK v1 variadic params must be the final parameter;
    // a splat followed by more params renders invalid `a*, b`
    if (it.scope.includes('parameter')) {
      let j = next?.type === 'identifier' ? i + 2 : i + 1
      while (content.at(j)?.is('sign', ',')) j++
      if (!content.at(j)?.is('edge', 'parameter-end')) {
        throw createTranspileError(
          ErrorType.UNSUPPORTED,
          `rest parameter must be the last parameter`,
          `Reorder the signature: (b, a...) -> and split 'a' inside the body`,
        )
      }
      continue
    }

    // `f(args...)` — already postfix; pass through when the operand is a
    // bare variable. `f(g()...)` would render `g()*`, so reject it too
    if (next?.is('edge', 'call-end') === true || next?.is('sign', ',') === true) {
      if (content.at(i - 1)?.type === 'identifier') continue
      throw createTranspileError(
        ErrorType.UNSUPPORTED,
        `spread operand must be a plain variable`,
        `Assign it to a variable first: tmp = expr; f(...tmp)`,
      )
    }

    // Only a bare variable may take postfix `*` — `f(...g())`, `f(...a + b)`
    // or `f(...(x))` would otherwise corrupt into `g*.Call()` / `a* + b` / `*(x)`
    if (next?.type !== 'identifier') {
      throw createTranspileError(
        ErrorType.UNSUPPORTED,
        `spread operand must be a plain variable`,
        `Assign it to a variable first: tmp = expr; f(...tmp)`,
      )
    }

    const after = content.at(i + 2)
    if (after?.is('edge', 'call-end') !== true && after?.is('sign', ',') !== true) {
      // `f(...a.b)` — a member/index chain can't take postfix `*`
      const memberish =
        after?.type === '.' ||
        after?.is('edge', 'index-start') === true ||
        after?.type === 'property'
      throw createTranspileError(
        ErrorType.UNSUPPORTED,
        memberish
          ? `spread of a member/index expression is not supported`
          : `spread operand must be a plain variable`,
        `Assign it to a variable first: tmp = expr; f(...tmp)`,
      )
    }

    content.splice(i, 1)
    content.splice(i + 1, 0, it)
  }
}

export default main
