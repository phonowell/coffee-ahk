import $ from 'fire-keeper'

// interface

type Pkg = {
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
}

// function

const main = async () => {
  const pkg = await $.read<Pkg>('./package.json')

  const listCmd = [
    ...Object.keys(pkg.devDependencies || {}),
    ...Object.keys(pkg.dependencies || {}),
  ]
    .map((name) => `pnpm i ${name}@latest`)

  await $.exec(listCmd)
}

// export
export default main
