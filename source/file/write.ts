import $write from 'fire-keeper/write'
import Item from '../module/Item'
import getName from 'fire-keeper/getName'
import iconv from 'iconv-lite'
import { Option } from '..'

// function

const main = async (
  source: string,
  data: {
    ast: Item[]
    content: string
  },
  option: Option,
): Promise<void> => {

  const { basename, dirname } = getName(source)

  await $write(`${dirname}/${basename}.ahk`, iconv.encode(data.content, 'utf8', {
    addBOM: true,
  }).toString())

  if (option.ast) await $write(`${dirname}/${basename}.ast.json`, data.ast)
}

// export
export default main