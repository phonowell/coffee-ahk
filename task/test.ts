import $ from 'fire-keeper'
import compile_ from '../source/index'

// function

async function main_(): Promise<void> {
  const listSource = await $.source_('./script/test/**/*.coffee')
  for (const source of listSource) {

    const target = source.replace('.coffee', '.ahk')
    const contentTarget = ((await $.read_(target) as Buffer) || '')
      .toString()
      .trim()

    const content = (await compile_(source, { verbose: true }))
      .trim()

    if (content !== contentTarget) {
      $.i(content)
      $.i('---')
      $.i(contentTarget)
      throw new Error(source)
    }
  }
  $.info('all test(s) passed!')
}

// export
export default main_