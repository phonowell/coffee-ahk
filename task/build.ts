import $ from 'fire-keeper'

// function

async function main_(): Promise<void> {

  await $.remove_('./script/**/*.ahk')

  const parseAsync = (await import('../source/index')).default

  await parseAsync([
    './script/*.coffee',
    './script/ffxiv/**/index.coffee',
    './script/other/*.coffee'
  ])

  for (const source of await $.source_('./script/ffxiv/**/index.ahk')) {
    const dirname = $.getDirname(source)
    const basename = $.getBasename(dirname)
    await $.write_(`${dirname}/${basename}.ahk`, await $.read_(source))
    await $.remove_(source)
  }

  await parseAsync('./script/test/*.coffee', {
    bare: true
  })
}

// export
export default main_