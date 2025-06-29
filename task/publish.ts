import { exec } from 'fire-keeper'

const main = async () => {
  // 使用git确认项目中是否存在未提交的代码，若有，则抛错
  const [, result] = await exec('git status --short')
  if (result) {
    console.log('存在未提交的文件')
    return
  }

  // 执行打包
  await exec('pnpm build')

  // 执行`npm version patch`，并获取其返回的tag号
  const [, version] = await exec('npm version patch')
  if (!version) {
    console.log('未能获取到合法版本号')
    return
  }

  // 调用`git push origin xxx`将tag推送至远端
  await exec(`git push origin ${version}`)

  // 提交所有更改
  await exec('git push origin main')

  // 调用`npm publish`发布包
  await exec('npm publish')
}

export default main
