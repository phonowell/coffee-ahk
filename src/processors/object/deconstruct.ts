// Object deconstruction functionality
import { OBJECT } from '../../constants.js'
import Item from '../../models/Item.js'
import { createTranspileError, ErrorType } from '../../utils/error.js'
import { getForbiddenReason, isVariableForbidden } from '../../utils/forbidden.js'

import type { Context } from '../../types/index.js'

type Entry = { key: string; name: string }

export const deconstruct = (ctx: Context) => {
  const { content } = ctx

  let pending: Entry[] = []
  const token = OBJECT
  let listContent: Item[] = []

  const pickIndent = (i: number): number => {
    for (let j = i; j >= 0; j--) {
      const it = content.at(j)
      if (!it) return 0
      if (it.type === 'new-line') return parseInt(it.value, 10)
    }
    return 0
  }

  // Parse `{ ... }` entries forward: `key`, `key: name`, or nested (unsupported)
  const parseEntries = (open: number, close: number): Entry[] => {
    const entries: Entry[] = []
    let j = open + 1
    while (j < close) {
      const it = content.at(j)
      if (!it) break

      if (it.is('sign', ',')) {
        j++
        continue
      }

      if (it.is('bracket', '{') || it.is('edge', 'array-start')) {
        throw createTranspileError(
          ErrorType.UNSUPPORTED,
          `nested destructuring in object pattern is not supported`,
          `Destructure nested objects in a separate statement`,
        )
      }

      if (it.type === 'property' || it.type === 'identifier') {
        const key = it.value
        const colon = content.at(j + 1)
        if (colon?.is('sign', ':')) {
          const target = content.at(j + 2)
          if (target?.type === 'identifier') {
            entries.push({ key, name: target.value })
            j += 3
            continue
          }
          throw createTranspileError(
            ErrorType.UNSUPPORTED,
            `unsupported destructuring target after '${key}:'`,
            `Use a plain variable name: '{ ${key}: name }'`,
          )
        }
        entries.push({ key, name: key })
        j++
        continue
      }

      throw createTranspileError(
        ErrorType.UNSUPPORTED,
        `unsupported '${it.value}' in object destructuring`,
        `Use '{ key }' or '{ key: variable }' patterns`,
      )
    }
    return entries
  }

  // each
  content.toArray().forEach((item, i) => {
    // output
    if (pending.length && item.type === 'new-line') {
      const indent = pickIndent(i - 1)
      const itemScope = item.scope

      for (const { key, name } of pending) {
        listContent = [
          ...listContent,
          // \n name = token[key]
          new Item({
            type: 'new-line',
            value: indent.toString(),
            scope: itemScope,
          }),
          new Item({ type: 'identifier', value: name, scope: itemScope }),
          new Item({ type: 'sign', value: '=', scope: itemScope }),
          new Item({ type: 'identifier', value: token, scope: itemScope }),
          new Item({ type: 'edge', value: 'index-start', scope: itemScope }),
          new Item({ type: 'string', value: `"${key}"`, scope: itemScope }),
          new Item({ type: 'edge', value: 'index-end', scope: itemScope }),
        ]
      }

      pending = []
      listContent.push(item)
      return
    }

    // find
    if (!item.is('sign', '=')) {
      listContent.push(item)
      return
    }
    if (!content.at(i - 1)?.is('bracket', '}')) {
      listContent.push(item)
      return
    }

    // locate matching '{' (nested '{' is rejected by parseEntries anyway,
    // but track depth so the scan stays correct)
    let depth = 1
    let open = -1
    for (let j = i - 2; j >= 0; j--) {
      const it = content.at(j)
      if (!it) break
      if (it.is('bracket', '}')) depth++
      else if (it.is('bracket', '{')) {
        depth--
        if (depth === 0) {
          open = j
          break
        }
      }
    }
    if (open < 0) {
      listContent.push(item)
      return
    }

    pending = [...pending, ...parseEntries(open, i - 1)]

    // drop the pattern items `{ ... }` already pushed to listContent
    listContent.length -= i - open

    // Validate object destructuring targets
    pending.forEach(({ name }) => {
      if (!isVariableForbidden(name)) return
      throw createTranspileError(
        ErrorType.FORBIDDEN,
        `object destructuring target '${name}' cannot be used (${getForbiddenReason(name)})`,
        `Choose a different variable name`,
      )
    })

    listContent = [
      ...listContent,
      new Item({ type: 'identifier', value: token, scope: item.scope }),
      new Item({ type: 'sign', value: '=', scope: item.scope }),
    ]
  })

  // reload
  content.reload(listContent)
}
