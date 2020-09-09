import $ from 'fire-keeper'

// function

async function main_(
  source: string,
  content: string
): Promise<void> {

  const { basename, dirname } = $.getName(source)
  const extname = '.ahk'

  await $.write_(`${dirname}/${basename}${extname}`, content)
}

// export
export default main_