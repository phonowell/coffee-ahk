import kleur from 'kleur'

import pad from '../utils/pad'

import type Item from '../models/Item'

const log = (message: string | number) => {
  const msg = typeof message !== 'string' ? message.toString() : message

  console.log()
  console.log(kleur.blue(pad(msg, 80, '-')))
}

const main = (ast: Item[]) => {
  let line = 0
  log(++line)

  for (let i = 0; i < ast.length; i++) {
    const item = ast[i]
    console.log(i, item)
    if (item.type === 'new-line') log(++line)
  }

  log('eof')
}

export default main
