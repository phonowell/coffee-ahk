import iconv from 'iconv-lite'
import { getName, write } from 'fire-keeper'

import { OptionPartial } from '..'
import Item from '../models/Item'

// function

const main = async (
  source: string,
  data: {
    ast: Item[]
    content: string
  },
  option: OptionPartial,
): Promise<void> => {
  const { basename, dirname } = getName(source)

  await write(
    `${dirname}/${basename}.ahk`,
    iconv
      .encode(data.content, 'utf8', {
        addBOM: true,
      })
      .toString(),
  )

  if (option.ast) await write(`${dirname}/${basename}.ast.json`, data.ast)
}

// export
export default main
