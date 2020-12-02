// interface

import { Context } from '../../type'
type Item = Context['content']['list'][number]

// function

function appendBind(
  ctx: Context
): void {

  const { content } = ctx

  const listContent: Item[] = []
  content.list.forEach(item => {

    listContent.push(item)
    if (!content.equal(item, 'edge', 'block-end')) return
    if (item.scope[item.scope.length - 1] !== 'function') return
    if (item.scope[item.scope.length - 2] !== 'class') return

    // TODO: find edge of parameter start, then check function name

    const scope = [[...item.scope]]
    scope[1] = [...scope[0], 'call']
    listContent.push(content.new('.', '.', scope[0]))
    listContent.push(content.new('identifier', 'Bind', scope[0]))
    listContent.push(content.new('edge', 'call-start', scope[1]))
    listContent.push(content.new('this', 'this', scope[1]))
    listContent.push(content.new('edge', 'call-end', scope[1]))
  })

  content.load(listContent)
}

function main(
  ctx: Context
): void {

  prependThis(ctx)
  appendBind(ctx)
  renameConstructor(ctx)
}

function prependThis(
  ctx: Context
): void {

  const { content } = ctx

  const listContent: Item[] = []
  content.list.forEach((item, i) => {

    listContent.push(item)
    if (!content.equal(item, 'edge', 'parameter-start')) return

    if (content.equal(
      listContent[listContent.length - 3],
      'property', 'constructor'
    )) {
      listContent[listContent.length - 2].type = 'void'
      return
    }

    if (!(
      item.scope[item.scope.length - 1] === 'class'
      || (
        item.scope[item.scope.length - 1] === 'parameter'
        && item.scope[item.scope.length - 2] === 'class'
      )
    )) return

    const scope = [...item.scope]
    listContent.push(content.new('this', 'this', scope))

    const it = content.eq(i + 1)
    if (content.equal(it, 'edge', 'parameter-end')) return
    listContent.push(content.new('sign', ',', scope))
  })

  content.load(listContent)
}

function renameConstructor(
  ctx: Context
): void {

  const { content } = ctx
  content.list.forEach(it => {
    if (!content.equal(it, 'property', 'constructor')) return
    it.value = '__New'
  })
}

// export
export default main