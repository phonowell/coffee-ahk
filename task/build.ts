import { exec, read, remove, write } from 'fire-keeper'

export default async () => {
  // Setup
  await exec('pnpm i')
  await remove('./dist')

  // Generate forbiddens
  await write('./data/forbidden.json', await read('./data/forbidden.yaml'))

  // Generate builtins
  const c2a = (await import('../src/index.js')).default
  for (const segment of ['changeIndex', 'typeof']) {
    try {
      await c2a(`./script/segment/${segment}.coffee`, {
        ast: false,
        metadata: false,
        salt: 'salt',
        save: true,
      })
      console.log(`Generated ${segment}.ahk`)
    } catch (error) {
      console.warn(`Failed to generate ${segment}:`, error)
    }
  }

  const changeIndexAhk = await read('./script/segment/changeIndex.ahk')
  const typeofAhk = await read('./script/segment/typeof.ahk')

  await write(
    './src/processors/builtins.gen.ts',
    [
      '// This file is auto-generated during build. Do not edit manually.',
      '',
      `export const changeIndex_ahk = \`${changeIndexAhk?.toString().trim()}\``,
      '',
      `export const typeof_ahk = \`${typeofAhk?.toString().trim()}\``,
      '',
    ].join('\n'),
  )

  // Build
  await exec('node esbuild.config.js')
  await exec('tsc --emitDeclarationOnly')

  // Cleanup
  await remove(['./dist/**/*', '!./dist/index.js', '!./dist/index.d.ts'])
}
