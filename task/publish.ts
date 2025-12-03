import { exec } from 'fire-keeper'

const MAIN_BRANCH = 'main'

/** 检查 Git 工作区是否干净 */
const ensureCleanWorkingTree = async (): Promise<void> => {
  const [, status] = await exec('git status --short')
  if (status?.trim()) {
    throw new Error('存在未提交的文件，请先提交所有更改')
  }
}

/** 获取新版本号并创建 Git tag */
const bumpVersion = async (): Promise<string> => {
  const [, version] = await exec('npm version patch')
  if (!version?.trim()) {
    throw new Error('未能获取到合法版本号')
  }
  return version.trim()
}

/** 推送代码和 tag 到远程仓库 */
const pushToRemote = async (version: string): Promise<void> => {
  await exec(`git push origin ${version}`)
  await exec(`git push origin ${MAIN_BRANCH}`)
}

export default async () => {
  // 确保工作区干净
  await ensureCleanWorkingTree()

  // 执行构建
  await exec('pnpm build')

  // 升级版本号
  const version = await bumpVersion()

  // 推送到远程仓库
  await pushToRemote(version)

  // 发布到 npm
  await exec('npm publish')
}
