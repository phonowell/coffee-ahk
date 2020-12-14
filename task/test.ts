import $ from 'fire-keeper'
import compile_ from '../source'

// function

async function main_(): Promise<void> {

  const target = pickTarget()

  const listSource = await $.source_(`./script/test/**/${target || '*'}.coffee`)
  for (const source of listSource) {

    const target = source.replace('.coffee', '.ahk')
    const contentTarget = ((await $.read_(target) as Buffer) || '')
      .toString()
      .replace(/\r/g, '')
      .trim()

    const content = (await compile_(source, {
      ignoreComment: false,
      insertGlobalThis: false,
      insertTranslatorInformation: false,
      salt: 'ahk',
      save: false
    }))
      .replace(/\r/g, '')
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

function pickTarget(): string {
  const argv = $.argv()
  return argv._[1] || argv.target || ''
}

// export
export default main_