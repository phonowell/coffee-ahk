import $ from 'fire-keeper'
import _ from 'lodash'
import { encodeFnName, regFn } from './fn'

// interface

import { Block } from '../type'

type Yaml = [
  string[], string[]
]

// const

const Rule = [
  '$.beep',
  '$.click',
  '$.exit',
  // '$.findColor': $findColor,
  // '$.findImage': $findImage,
  // '$.getColor': $getColor,
  // '$.getPosition': $getPosition,
  // '$.getState': $getState,
  '$.info',
  // '$.isPressing': $isPressing,
  '$.move',
  '$.now',
  // '$.open': $open,
  // '$.press': $press,
  '$.reload',
  // '$.setFixed': $setFixed,
  '$.sleep',
  // '$.tip': $tip,
  '$.trim',
  '$.trimEnd',
  '$.trimStart',
  // '$.write': $write,
  '$.abs',
  '$.ceil',
  '$.floor',
  '$.round',
  '$.alert',
  // 'clearInterval': $clearInterval,
  // 'clearTimeout': $clearTimeout,
  // 'prompt': $prompt,
  // 'setInterval': $setInterval,
  // 'setTimeout': $setTimeout
] as const

// function

async function load_(
  name: string
): Promise<Block> {

  const filename = name.replace('$.', '')
  const [argument, content] = await $.read_(`./source/builtIn/${filename}.yaml`) as Yaml

  return {
    name,
    argument: argument.map(it => it.replace(/'/g, '"')),
    content: content.map(it => {
      let _it = it
        .replace(/'/g, '"')
        .replace(/\\\}/g, '}')
      if (_it.startsWith('\\_'))
        _it = _it.replace('\\_', '  ')
      return _it
    })
  }
}

async function main_(
  listVar: string[],
  listFn: Block[],
  listBlock: Block[]
): Promise<void> {

  const setResult: Set<typeof Rule[number]> = new Set()

  listBlock.forEach(block =>
    block.content.forEach(line => {
      for (const key of Rule) {
        if (!line.includes(key)) continue
        setResult.add(key as typeof Rule[number])
      }
    })
  )

  if (!setResult.size) return

  // variable
  listVar.unshift('$ = {}')

  // function

  const listResult: string[] = []

  for (const key of setResult) {
    const { name, argument, content } = await load_(key)
    const _name = regFn(listFn, name, argument, content)
    listResult.push(`${name} = Func('${_name}')`)
  }

  let block = _.find(listFn, {
    name: encodeFnName('$default')
  })
  if (!block) {
    regFn(listFn, '$default', [], [])
    block = _.find(listFn, {
      name: encodeFnName('$default')
    }) as Block
  }

  block.content = [
    ...listResult,
    ...block.content
  ]
}

// export
export default main_