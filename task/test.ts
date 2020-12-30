import $ from 'fire-keeper'
import compile_ from '../source'

// function

async function checkVersion_(): Promise<void> {

  const { version } = await $.read_('./package.json') as { version: string }
  const content = await $.read_('./source/renderer/index.ts') as string

  if (!content.includes(version))
    throw new Error('found different version')
}

async function main_(): Promise<void> {

  const target = pickTarget()

  async function sub_(
    source: string,
  ): Promise<void> {

    const _target = source.replace('.coffee', '.ahk')
    const contentTarget = ((await $.read_(_target) as Buffer) || '')
      .toString()
      .replace(/\r/gu, '')
      .trim()

    const content = (await compile_(source, {
      ignoreComment: false,
      insertTranslatorInformation: false,
      salt: 'ahk',
      save: false,
    }))
      .replace(/\r/gu, '')
      .trim()

    if (content !== contentTarget) {
      $.i(content)
      $.i('---')
      $.i(contentTarget)
      throw new Error(source)
    }
  }

  await Promise.all(
    (await $.source_(`./script/test/**/${target || '*'}.coffee`))
      .map(sub_)
  )
  $.info('all test(s) passed!')

  await checkVersion_()
}

function pickTarget(): string {
  const argv = $.argv()
  return argv._[1] || argv.target || ''
}

// export
export default main_
