import { echo, exec, read } from 'fire-keeper'

type PackageJson = {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

const DEPS_TO_INSTALL: string[] = ['clsx']

const DEV_DEPS_TO_INSTALL: string[] = [
  'eslint-plugin-unused-imports',
  'radash',
  'ts-morph',
  'unplugin-auto-import',
  'web-vitals',
]

const DEPS_TO_REMOVE: string[] = ['classnames', 'moment']

const getDeps = async () => {
  const pkg = await read<PackageJson>('./package.json')
  if (!pkg) return []

  const deps = [
    ...Object.entries(pkg.dependencies ?? {}),
    ...Object.entries(pkg.devDependencies ?? {}),
  ]

  return deps
}

const manageDeps = async () => {
  const deps = await getDeps()

  const depsToInstall = DEPS_TO_INSTALL.filter(
    (name) => !deps.some(([depName]) => depName === name),
  )

  if (depsToInstall.length) {
    const list = depsToInstall.join(' ')
    await exec(`pnpm add ${list}`)
  }

  const devDepsToInstall = DEV_DEPS_TO_INSTALL.filter(
    (name) => !deps.some(([depName]) => depName === name),
  )

  if (devDepsToInstall.length) {
    const list = devDepsToInstall.join(' ')
    await exec(`pnpm add -D ${list}`)
  }

  const depsToRemove = DEPS_TO_REMOVE.filter((name) =>
    deps.some(([depName]) => depName === name),
  )

  if (depsToRemove.length) {
    const list = depsToRemove.join(' ')
    await exec(`pnpm remove ${list}`)
  }
}

const updateDeps = async () => {
  const deps = await getDeps()

  const lockedDeps = deps.filter(
    ([, version]) => !Number.isNaN(Number(version[0])),
  )
  const unlockedDeps = deps.filter(([, version]) =>
    Number.isNaN(Number(version[0])),
  )

  const depsToUpdate = unlockedDeps
    .filter(([name]) => {
      if (name.endsWith('react') || name.endsWith('react-dom')) return false
      return true
    })
    .map(([name]) => name)

  if (depsToUpdate.length) {
    const list = depsToUpdate.map((name) => `${name}@latest`).join(' ')
    await exec(`pnpm up ${list}`)
  }

  echo(
    [
      'These dependencies have been locked:',
      ...lockedDeps.map((it) => `'${it.join('@')}'`),
    ].join('\n'),
  )
}

const main = async () => {
  await manageDeps()
  await updateDeps()
}

export default main
