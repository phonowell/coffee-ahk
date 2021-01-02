import { Context } from '../entry/type'
import Item from '../module/Item'

// variable

// eslint-disable-next-line sort-keys
const changeIndex = [{ "type": "origin", "value": "global ", "scope": [] }, { "type": "identifier", "value": "__ci_salt__", "scope": [] }, { "type": "sign", "value": "=", "scope": [] }, { "type": "function", "value": "anonymous", "scope": [] }, { "type": "edge", "value": "parameter-start", "scope": ["parameter"] }, { "type": "identifier", "value": "input", "scope": ["parameter"] }, { "type": "edge", "value": "parameter-end", "scope": ["parameter"] }, { "type": "edge", "value": "block-start", "scope": ["function"] }, { "type": "new-line", "value": "1", "scope": ["function"] }, { "type": "origin", "value": "if input is Number", "scope": ["function"] }, { "type": "new-line", "value": "1", "scope": ["function"] }, { "type": "origin", "value": "  return input + 1", "scope": ["function"] }, { "type": "new-line", "value": "1", "scope": ["function"] }, { "type": "statement", "value": "return", "scope": ["function"] }, { "type": "identifier", "value": "input", "scope": ["function"] }, { "type": "new-line", "value": "0", "scope": ["function"] }, { "type": "edge", "value": "block-end", "scope": ["function"] }, { "type": "new-line", "value": "0", "scope": [] }]

// function

function main(
  ctx: Context
): void {

  const { content } = ctx

  if (ctx.flag.isChangeIndexUsed) {

    const listItem: Item[] = (changeIndex as Item[]).map(it => Item.new(
      it.type,
      it.value,
      it.scope
    ))

    listItem[1].value = listItem[1].value
      .replace(/_salt_/gu, `_${ctx.option.salt}_`)

    content.load([
      ...listItem,
      ...content.list,
    ])
  }
}

// export
export default main
