import pad from 'lodash/pad'
import kleur from 'kleur'

// interface

import Item from '../formator/module/item'

// function

function log(
  msg: string | number
): void {

  if (typeof msg !== 'string')
    msg = msg.toString()

  console.log()
  console.log(kleur.blue(pad(msg, 80, '-')))
}

function main(
  ast: Item[]
): void {

  let line = 0
  log(++line)

  for (let i = 0; i < ast.length; i++) {
    const item = ast[i]
    console.log(i, item)
    if (item.type === 'new-line')
      log(++line)
  }

  log('eof')
}

// export
export default main