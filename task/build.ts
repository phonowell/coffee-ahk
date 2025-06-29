import { exec, read, remove, write } from 'fire-keeper'

const cleanup = () => remove('./dist')

const genForbiddens = async () => {
  const content = await read('./data/forbidden.yaml')
  await write('./data/forbidden.json', content)
}

// 生成built-in函数
const genBuiltins = async () => {
  // 导入编译器
  const c2a = (await import('../src/index.js')).default

  // 编译segment文件
  const segments = ['changeIndex']

  for (const segment of segments) {
    const sourcePath = `./script/segment/${segment}.coffee`
    try {
      await c2a(sourcePath, {
        ast: false,
        metadata: false,
        salt: 'salt',
        save: true,
      })
      console.log(`Generated ${segment}.ahk from ${segment}.coffee`)
    } catch (error) {
      console.warn(`Failed to generate ${segment}:`, error)
    }
  }

  // 生成 builtins.gen.ts 静态集成文件
  const buffer = await read('./script/segment/changeIndex.ahk')
  if (!buffer)
    throw new Error('Failed to read ./script/segment/changeIndex.ahk')

  const content = buffer.toString().trim()
  const result = [
    '// This file is auto-generated during build. Do not edit manually.',
    '',
    `export const changeIndex_ahk = \`${content}\``,
    '',
  ].join('\n')

  await write('./src/processors/builtins.gen.ts', result)
}

const main = async () => {
  await exec('pnpm i')
  await cleanup()
  await genForbiddens()
  // 在构建过程中生成built-in函数
  await genBuiltins()
}

export default main
