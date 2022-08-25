import $ from 'fire-keeper'
import c2aViaTs from '../source'
import c2aViaJs from '../dist'

// function

const checkVersion = async () => {
  const { version } = await $.read<{ version: string }>('./package.json')
  const content = await $.read('./source/renderer/index.ts')

  if (!content?.includes(version)) throw new Error('found different version')
}

const compile = async (source: string) =>
  (
    await c2aViaTs(source, {
      ignoreComment: false,
      insertTranspilerInformation: false,
      salt: 'ahk',
      save: false,
    })
  )
    .replace(/\r/g, '')
    .trim()

const compile2 = async (source: string) =>
  (
    await c2aViaJs(source, {
      ignoreComment: false,
      insertTranspilerInformation: false,
      salt: 'ahk',
      save: false,
    })
  )
    .replace(/\r/g, '')
    .trim()

const main = async () => {
  await $.exec('npm run build')

  const target = pickTarget()
  const listSource = await $.glob(`./script/test/**/${target || '*'}.coffee`)
  for (const source of listSource) {
    const _target = source.replace('.coffee', '.ahk')
    const contentTarget = ((await $.read(_target)) || '')
      .toString()
      .replace(/\r/g, '')
      .trim()

    const content = await compile(source)
    if (content !== contentTarget) {
      console.log(content)
      console.log('---')
      console.log(contentTarget)
      throw new Error(source)
    }

    const content2 = await compile2(source)
    if (content2 !== contentTarget) {
      console.log(content2)
      console.log('---')
      console.log(contentTarget)
      throw new Error(source)
    }
  }

  $.log('all test(s) passed!')

  await checkVersion()
}

const pickTarget = () => {
  const argv = $.argv()
  return (argv._[1] as string) || (argv.target as string) || ''
}

// export
export default main
