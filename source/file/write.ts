import $ from 'fire-keeper'
import Item from '../module/Item'
import { Option } from '..'
import iconv from 'iconv-lite'

// function

async function main_(
  source: string,
  data: {
    ast: Item[]
    content: string
  },
  option: Option
): Promise<void> {

  const { basename, dirname } = $.getName(source)

  await $.write_(`${dirname}/${basename}.ahk`, iconv.encode(data.content, 'utf8', {
    addBOM: true,
  }).toString())

  if (option.ast)
    await $.write_(`${dirname}/${basename}.ast.json`, data.ast)
}

// export
export default main_
