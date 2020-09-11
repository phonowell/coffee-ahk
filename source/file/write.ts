import $ from 'fire-keeper'
import iconv from 'iconv-lite'

// function

async function main_(
  source: string,
  data: {
    ast: Object[]
    content: string
  }
): Promise<void> {

  const { basename, dirname } = $.getName(source)

  await $.write_(`${dirname}/${basename}.ahk`, iconv.encode(data.content, 'utf8', {
    addBOM: true
  }).toString())
  await $.write_(`${dirname}/${basename}.ast.json`, data.ast)
}

// export
export default main_