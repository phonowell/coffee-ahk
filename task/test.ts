import { argv, echo, glob, read, write } from 'fire-keeper'

import c2aViaJs from '../dist/index.js'
import c2aViaTs from '../src/index.js'

const compile = async (source: string) =>
  (
    await c2aViaTs(source, {
      metadata: false,
      salt: 'ahk',
      save: false,
    })
  )
    .replace(/\r/g, '')
    .trim()

const compile2 = async (source: string) =>
  (
    await c2aViaJs(source, {
      metadata: false,
      salt: 'ahk',
      save: false,
    })
  )
    .replace(/\r/g, '')
    .trim()

const main = async () => {
  const target = await pickTarget()

  const pattern = `./script/test/**/${
    !!target && target !== 'overwrite' ? target : '*'
  }.coffee`

  const listSource = await glob(pattern)

  for (const source of listSource) {
    const target2 = source.replace('.coffee', '.ahk')

    const content = await compile(source)
    if (target === 'overwrite') {
      await write(target2, content)
      continue
    }

    const contentTarget = ((await read(target2)) ?? '')
      .toString()
      .replace(/\r/g, '')
      .trim()

    if (content !== contentTarget) {
      console.log(content)
      console.log('---TURN 1---')
      console.log(contentTarget)
      throw new Error(source)
    }

    const content2 = await compile2(source)
    if (content2 !== contentTarget) {
      console.log(content2)
      console.log('---TURN 2---')
      console.log(contentTarget)
      throw new Error(source)
    }
  }

  echo('all test(s) passed!')
}

const pickTarget = async () => {
  const a = await argv()
  return a._[1] ?? a.target
}

export default main
