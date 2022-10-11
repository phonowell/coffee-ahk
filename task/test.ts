import $ from 'fire-keeper'
import c2aViaTs from '../source'
import c2aViaJs from '../dist'

// function

const checkVersion = async () => {
  const pkg = await $.read<{ version: string }>('./package.json')
  if (!pkg) throw new Error('package.json not found')
  const { version } = pkg
  const content = await $.read('./source/renderer/index.ts')

  if (!content?.includes(version)) throw new Error('found different version')
}

const compile = async (source: string) =>
  (
    await c2aViaTs(source, {
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
      insertTranspilerInformation: false,
      salt: 'ahk',
      save: false,
    })
  )
    .replace(/\r/g, '')
    .trim()

const main = async () => {
  // await $.exec('npm run build')
  // await $.sleep(1e3)

  const target = pickTarget()
  const listSource = await $.glob(`./script/test/**/${target || '*'}.coffee`)
  for (const source of listSource) {
    const target2 = source.replace('.coffee', '.ahk')
    const contentTarget = ((await $.read(target2)) || '')
      .toString()
      .replace(/\r/g, '')
      .trim()

    const content = await compile(source)
    if (content !== contentTarget) {
      console.log(content)
      console.log('---TURN 1---')
      console.log(contentTarget)
      throw new Error(source)
    }

    const content2 = await compile2(source)
    if (content2 !== contentTarget) {
      console.log(content2)
      console.log('---TURN 2---')
      console.log(contentTarget)
      throw new Error(source)
    }
  }

  $.echo('all test(s) passed!')

  await checkVersion()
}

const pickTarget = () => {
  const argv = $.argv()
  return (argv._[1] as string) || (argv.target as string) || ''
}

// export
export default main
