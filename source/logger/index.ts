import kleur from 'kleur'
import pad from 'lodash/pad'

import Item from '../module/Item'

// function

const log = (message: string | number): void => {
  const msg = typeof message !== 'string' ? message.toString() : message

  console.log()
  console.log(kleur.blue(pad(msg, 80, '-')))
}

const main = (ast: Item[]): void => {
  let line = 0
  log(++line)

  for (let i = 0; i < ast.length; i++) {
    const item = ast[i]
    console.log(i, item)
    if (item.type === 'new-line') log(++line)
  }

  log('eof')
}

// export
export default main
