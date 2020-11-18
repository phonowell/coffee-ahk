import $ from 'fire-keeper'
import iconv from 'iconv-lite'

// interface

import { Option } from '..'

// function

async function main_(
  source: string,
  data: {
    ast: Object[]
    content: string
  },
  option: Option
): Promise<void> {

  const { basename, dirname } = $.getName(source)

  await $.write_(`${dirname}/${basename}.ahk`, iconv.encode(data.content, 'utf8', {
    addBOM: true
  }).toString())

  if (option.ast)
    await $.write_(`${dirname}/${basename}.ast.json`, data.ast)
}

// export
export default main_