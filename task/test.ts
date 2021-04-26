import $argv from 'fire-keeper/argv'
import $i from 'fire-keeper/i'
import $info from 'fire-keeper/info'
import $read_ from 'fire-keeper/read_'
import $source_ from 'fire-keeper/source_'
import c2a from '../source'

// function

const checkVersion = async () => {

  const { version } = await $read_<{ version: string }>('./package.json')
  const content = await $read_<string>('./source/renderer/index.ts')

  if (!content.includes(version))
    throw new Error('found different version')
}

const main = async () => {

  const target = pickTarget()

  await Promise.all(
    (await $source_(`./script/test/**/${target || '*'}.coffee`)).map(
      source => (async () => {

        const _target = source.replace('.coffee', '.ahk')
        const contentTarget = ((await $read_<Buffer>(_target)) || '')
          .toString()
          .replace(/\r/gu, '')
          .trim()

        const content = (await c2a(source, {
          ignoreComment: false,
          insertTranspilerInformation: false,
          salt: 'ahk',
          save: false,
        }))
          .replace(/\r/gu, '')
          .trim()

        if (content !== contentTarget) {
          $i(content)
          $i('---')
          $i(contentTarget)
          throw new Error(source)
        }
      })()
    )
  )
  $info('all test(s) passed!')

  await checkVersion()
}

const pickTarget = () => {
  const argv = $argv()
  return argv._[1] as string || argv.target as string || ''
}

// export
export default main