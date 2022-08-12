import { Context } from '../entry/type'
import Item from '../module/Item'

// variable

// eslint-disable-next-line sort-keys
const changeIndex: Item[] = [
  { type: 'origin', value: 'global ', scope: [] },
  { type: 'identifier', value: '__ci_salt__', scope: [] },
  { type: 'sign', value: '=', scope: [] },
  { type: 'function', value: 'anonymous', scope: [] },
  { type: 'edge', value: 'parameter-start', scope: ['parameter'] },
  { type: 'identifier', value: '__ipt__', scope: ['parameter'] },
  { type: 'edge', value: 'parameter-end', scope: ['parameter'] },
  { type: 'edge', value: 'block-start', scope: ['function'] },
  { type: 'new-line', value: '1', scope: ['function'] },
  { type: 'origin', value: 'if __ipt__ is Number', scope: ['function'] },
  { type: 'new-line', value: '1', scope: ['function'] },
  { type: 'origin', value: '  return __ipt__ + 1', scope: ['function'] },
  { type: 'new-line', value: '1', scope: ['function'] },
  { type: 'statement', value: 'return', scope: ['function'] },
  { type: 'identifier', value: '__ipt__', scope: ['function'] },
  { type: 'new-line', value: '0', scope: ['function'] },
  { type: 'edge', value: 'block-end', scope: ['function'] },
  { type: 'new-line', value: '0', scope: [] },
]

// eslint-disable-next-line sort-keys
const executeIfExists: Item[] = [
  { type: 'origin', value: 'global ', scope: [] },
  { type: 'identifier', value: '__eie_salt__', scope: [] },
  { type: 'sign', value: '=', scope: [] },
  { type: 'function', value: 'anonymous', scope: [] },
  { type: 'edge', value: 'parameter-start', scope: ['parameter'] },
  { type: 'identifier', value: '__callback__', scope: ['parameter'] },
  { type: 'edge', value: 'parameter-end', scope: ['parameter'] },
  { type: 'edge', value: 'block-start', scope: ['function'] },
  { type: 'new-line', value: '1', scope: ['function'] },
  { type: 'if', value: 'if', scope: ['function'] },
  { type: 'logical-operator', value: '!', scope: ['function'] },
  { type: 'edge', value: 'expression-start', scope: ['function'] },
  { type: 'identifier', value: 'IsFunc', scope: ['function'] },
  { type: 'edge', value: 'call-start', scope: ['function', 'call'] },
  { type: 'identifier', value: '__callback__', scope: ['function', 'call'] },
  { type: 'edge', value: 'call-end', scope: ['function', 'call'] },
  { type: 'edge', value: 'expression-end', scope: ['function'] },
  { type: 'edge', value: 'block-start', scope: ['function', 'if'] },
  { type: 'new-line', value: '2', scope: ['function', 'if'] },
  { type: 'statement', value: 'return', scope: ['function', 'if'] },
  { type: 'string', value: '""', scope: ['function', 'if'] },
  { type: 'new-line', value: '1', scope: ['function', 'if'] },
  { type: 'edge', value: 'block-end', scope: ['function', 'if'] },
  { type: 'new-line', value: '1', scope: ['function'] },
  { type: 'statement', value: 'return', scope: ['function'] },
  { type: 'identifier', value: '__callback__', scope: ['function'] },
  { type: 'edge', value: 'call-start', scope: ['function', 'call'] },
  { type: 'edge', value: 'call-end', scope: ['function', 'call'] },
  { type: 'new-line', value: '0', scope: ['function'] },
  { type: 'edge', value: 'block-end', scope: ['function'] },
  { type: 'new-line', value: '0', scope: [] },
]

// function

const insert = (ctx: Context, flag: string, fn: Item[]) => {
  const { content } = ctx

  if (ctx.flag[flag]) {
    const listItem: Item[] = fn.map(it => Item.new(it.type, it.value, it.scope))

    listItem[1].value = listItem[1].value.replace(
      /_salt_/g,
      `_${ctx.option.salt}_`
    )

    content.load([...listItem, ...content.list])
  }
}

const main = (ctx: Context): void => {
  insert(ctx, 'isChangeIndexUsed', changeIndex)
  insert(ctx, 'isExecuteIfExistsUsed', executeIfExists)
}

// export
export default main
