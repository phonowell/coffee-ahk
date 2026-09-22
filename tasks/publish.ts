import { exec } from 'fire-keeper'

const MAIN_BRANCH = 'main'

/** 检查 Git 工作区是否干净 */
const ensureCleanWorkingTree = async (): Promise<void> => {
  const [, status] = await exec('git status --short')
  if (status?.trim()) {
    throw new Error('存在未提交的文件，请先提交所有更改')
  }
}

/** 升级版本号并创建 Git tag（npm version 自动 commit + tag v0.0.x） */
const bumpVersion = async (): Promise<string> => {
  const [, version] = await exec('npm version patch')
  if (!version?.trim()) {
    throw new Error('未能获取到合法版本号')
  }
  return version.trim()
}

/** 推送代码和 tag 到远程仓库，触发 release workflow */
const pushToRemote = async (): Promise<void> => {
  await exec(`git push origin ${MAIN_BRANCH} --tags`)
}

export default async () => {
  // 确保工作区干净
  await ensureCleanWorkingTree()

  // 执行构建（预检，失败则不推 tag）
  await exec('pnpm build')

  // 升级版本号并打 tag
  const version = await bumpVersion()

  // 推送到远程仓库，由 .github/workflows/release.yml 完成 npm publish + GitHub Release
  await pushToRemote()

  console.log(`已推送 ${version}，等待 GitHub Actions 完成发布`)
}
