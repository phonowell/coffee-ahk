// interface

import { Context } from '../type'
type Item = Context['content']['list'][number]

// function

function main(
  ctx: Context
): void {

  const { content } = ctx

  if (ctx.flag.isChangeIndexUsed) {
    const listChangeIndex: Item[] = [
      content.new('identifier', `__change_index_${ctx.option.salt}__`, []),
      content.new('sign', '=', []),
      content.new('identifier', 'anonymous', []),
      content.new('edge', 'parameter-start', ['parameter']),
      content.new('identifier', 'input', ['parameter']),
      content.new('edge', 'parameter-end', ['parameter']),
      content.new('edge', 'block-start', ['function']),
      content.new('new-line', '1', ['function']),
      content.new('origin', 'if input is Number', ['function']),
      content.new('new-line', '2', ['function']),
      content.new('origin', 'return input + 1', ['function']),
      content.new('new-line', '1', ['function']),
      content.new('origin', 'return input', ['function']),
      content.new('new-line', '0', ['function']),
      content.new('edge', 'block-end', ['function']),
      content.new('new-line', '0', [])
    ]

    content.load([
      ...listChangeIndex,
      ...content.list
    ])
  }
}

// export
export default main