import $ from 'fire-keeper'
import transpile from '../source'

// function

async function checkVersion_(): Promise<void> {

  const { version } = await $.read_('./package.json') as { version: string }
  const content = await $.read_('./source/renderer/index.ts') as string

  if (!content.includes(version))
    throw new Error('found different version')
}

async function main_(): Promise<void> {

  const target = pickTarget()

  await Promise.all(
    (await $.source_(`./script/test/**/${target || '*'}.coffee`)).map(
      source => (async () => {

        const _target = source.replace('.coffee', '.ahk')
        const contentTarget = ((await $.read_(_target) as Buffer) || '')
          .toString()
          .replace(/\r/gu, '')
          .trim()

        const content = (await transpile(source, {
          ignoreComment: false,
          insertTranspilerInformation: false,
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
      })()
    )
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
