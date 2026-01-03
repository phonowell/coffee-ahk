import { exec, read, remove, write } from 'fire-keeper'

import type { PartialOptions } from '../src/index.js'

const SEGMENTS = ['changeIndex', 'typeof'] as const
const PATHS = {
  forbidden: {
    yaml: './data/forbidden.yaml',
    json: './data/forbidden.json',
  },
  segment: (name: string) => `./script/segment/${name}`,
  builtins: './src/processors/builtins.gen.ts',
  dist: './dist',
} as const

type Transpiler = (source: string, options?: PartialOptions) => Promise<string | undefined>

/** 生成单个内置函数的 .ahk 文件 */
const generateSegment = async (c2a: Transpiler, segment: string) => {
  const source = `${PATHS.segment(segment)}.coffee`
  await c2a(source, {
    ast: false,
    metadata: false,
    salt: 'salt',
    save: true,
  })
  console.log(`Generated ${segment}.ahk`)
}

/** 生成 builtins.gen.ts 文件 */
const generateBuiltins = async () => {
  const segments = await Promise.all(
    SEGMENTS.map(async (name) => {
      const ahk = await read(`${PATHS.segment(name)}.ahk`)
      return { name, content: ahk?.toString().trim() ?? '' }
    }),
  )

  const lines = [
    '// This file is auto-generated during build. Do not edit manually.',
    '',
    ...segments.flatMap(({ name, content }) => [
      `export const ${name}_ahk = \`${content}\``,
      '',
    ]),
  ]

  await write(PATHS.builtins, lines.join('\n'))
}

export default async () => {
  // Setup
  await exec('pnpm i')
  await remove(PATHS.dist)

  // Generate forbiddens
  await write(PATHS.forbidden.json, await read(PATHS.forbidden.yaml))

  // Generate builtins
  const c2a = (await import('../src/index.js')).default

  for (const segment of SEGMENTS) {
    await generateSegment(c2a, segment)
  }

  await generateBuiltins()

  // Build
  await exec('node esbuild.config.js')
  await exec('tsc --emitDeclarationOnly')

  // Cleanup
  await remove(['./dist/**/*', '!./dist/index.js', '!./dist/index.d.ts'])
}
