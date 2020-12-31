import Item from '../module/Item'
import { Option } from '..'
import getName from 'fire-keeper/getName'
import iconv from 'iconv-lite'
import write_ from 'fire-keeper/write_'

// function

async function main_(
  source: string,
  data: {
    ast: Item[]
    content: string
  },
  option: Option
): Promise<void> {

  const { basename, dirname } = getName(source)

  await write_(`${dirname}/${basename}.ahk`, iconv.encode(data.content, 'utf8', {
    addBOM: true,
  }).toString())

  if (option.ast)
    await write_(`${dirname}/${basename}.ast.json`, data.ast)
}

// export
export default main_
