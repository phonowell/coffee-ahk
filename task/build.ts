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
  const segments = ['changeIndex', 'returnFunction', 'Promise']

  for (const segment of segments) {
    const sourcePath = `./script/segment/${segment}.coffee`
    try {
      await c2a(sourcePath, {
        ast: false,
        metadata: false,
        anonymous: false,
        salt: 'salt',
        builtins: false, // 避免循环依赖
        save: true,
      })
      console.log(`Generated ${segment}.ahk from ${segment}.coffee`)
    } catch (error) {
      console.warn(`Failed to generate ${segment}:`, error)
    }
  }
}

const main = async () => {
  await exec('pnpm i')
  await cleanup()
  await genForbiddens()
  // 在构建过程中生成built-in函数
  await genBuiltins()
}

export default main
