import { glob } from 'fire-keeper'
import { expect, test } from 'vitest'

const PROCESSOR_ALIASES: Record<string, string[]> = {
  array: ['array', 'collection-index', 'negative-index'],
  'build-in-loader': ['import-json', 'import-yaml', 'module'],
  class: ['class', 'class-case-sensitivity'],
  function: [
    'anonymous',
    'bind',
    'closure',
    'do',
    'function',
    'implicit-param',
    'implicit-return',
    'loop-ctx',
    'mark',
    'nested-fat-arrow',
    'params',
  ],
  'logical-or': ['logical-or-default'],
  module: ['import-json', 'import-yaml', 'module'],
  object: ['complex-reverse-destructure', 'deconstruct', 'object', 'shorthand'],
  variable: ['validate', 'variable'],
}

const FORMATTER_ALIASES: Record<string, string[]> = {
  array: ['array', 'collection-index', 'negative-index'],
  class: ['class', 'class-case-sensitivity'],
  comment: ['comments'],
  do: ['do'],
  for: ['for'],
  function: [
    'anonymous',
    'bind',
    'closure',
    'function',
    'implicit-param',
    'implicit-return',
    'nested-fat-arrow',
    'params',
  ],
  if: ['if', 'if-expression'],
  module: ['import-json', 'import-yaml', 'module'],
  object: ['complex-reverse-destructure', 'deconstruct', 'object', 'shorthand'],
}

const ERROR_COVERAGE = new Set([
  'array',
  'class',
  'for',
  'forbidden',
  'number',
  'operator',
  'variable',
])

const componentNameFromPath = (file: string, group: string) =>
  file.match(new RegExp(`/${group}/(.+?)(?:/index)?\\.ts$`))?.[1]

const isCoveredByFixtures = (
  name: string,
  fixtures: Set<string>,
  aliases: Record<string, string[]>,
) => fixtures.has(name) || (aliases[name] ?? []).some((alias) => fixtures.has(alias))

test('formatter/processor reachability report', async () => {
  const formatters = await glob('./src/formatters/*.ts')
  const processors = await glob(['./src/processors/*.ts', './src/processors/*/index.ts'])
  const testFiles = await glob('./script/test/*.coffee')

  const formatterNames = formatters
    .filter((f) => !f.includes('/index.ts'))
    .map((f) => componentNameFromPath(f, 'formatters'))
    .filter((name): name is string => Boolean(name))

  const processorNames = processors
    .filter((f) => !f.includes('builtins.gen.ts') && !f.endsWith('/src/processors/index.ts'))
    .map((f) => componentNameFromPath(f, 'processors'))
    .filter((name): name is string => Boolean(name))

  const fixtureNames = new Set(
    testFiles
      .map((f) => f.match(/\/([\w-]+)\.coffee$/)?.[1])
      .filter((name): name is string => Boolean(name)),
  )

  const untestedFormatters = formatterNames.filter(
    (n) => !isCoveredByFixtures(n, fixtureNames, FORMATTER_ALIASES) && !ERROR_COVERAGE.has(n),
  )
  const untestedProcessors = processorNames.filter(
    (n) => !isCoveredByFixtures(n, fixtureNames, PROCESSOR_ALIASES) && !ERROR_COVERAGE.has(n),
  )

  const total = formatterNames.length + processorNames.length
  const tested = total - untestedFormatters.length - untestedProcessors.length

  console.log(
    `\n🧭 Reachability: ${tested}/${total} mapped` +
      (untestedFormatters.length
        ? `\n   unmapped formatters: ${untestedFormatters.join(', ')}`
        : '') +
      (untestedProcessors.length
        ? `\n   unmapped processors: ${untestedProcessors.join(', ')}`
        : ''),
  )

  expect(tested).toBeGreaterThan(0)
})
