import $ from 'fire-keeper'

// function

async function main_(): Promise<void> {

  const parseAsync = (await import('../source/index')).default

  $.watch('./script/ffxiv/**/*.coffee', async (e: { path: string }) => {
    const dirname = $.getDirname(e.path)
    const basename = $.getBasename(dirname)
    const source = `${dirname}/index.coffee`
    const target = `${dirname}/index.ahk`
    await parseAsync(source)
    await $.write_(`${dirname}/${basename}.ahk`, await $.read_(target))
    await $.remove_(target)
  })

  $.watch('./script/test/*.coffee', async (e: { path: string }) =>
    await parseAsync(e.path)
  )
}

// export
export default main_