import $ from 'fire-keeper'

// function

async function main_(): Promise<void> {
  const listSource = await $.source_([
    './script/test/**/*.coffee',
    './script/test/**/*.ahk'
  ])
  for (const source of listSource) {
    const content = (await $.read_(source) as Buffer)
      .toString()
    const cont = content.trim()
    if (cont === content) continue
    await $.write_(source, cont)
  }
}

// export
export default main_