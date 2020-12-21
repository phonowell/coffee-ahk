import $ from 'fire-keeper'
import compile_ from '../source'

// function

async function checkVersion_(): Promise<void> {

  const { version } = await $.read_('./package.json') as { version: string }
  const content = await $.read_('./source/formator/renderer/index.ts') as string

  if (!content.includes(version))
    throw new Error('found different version')
}

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

  await checkVersion_()
}

function pickTarget(): string {
  const argv = $.argv()
  return argv._[1] || argv.target || ''
}

// export
export default main_