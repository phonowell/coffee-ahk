import { echo, glob } from 'fire-keeper'

/**
 * Reachability report for public formatter/processor entrypoints.
 * This is intentionally stricter than text-search "coverage" and
 * avoids claiming percentages that look like real code coverage.
 */

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

const main = async () => {
  const formatters = await glob('./src/formatters/*.ts')
  const processors = await glob([
    './src/processors/*.ts',
    './src/processors/*/index.ts',
  ])
  const testFiles = await glob('./script/test/*.coffee')

  const formatterNames = formatters
    .filter((f) => !f.includes('/index.ts'))
    .map((f) => componentNameFromPath(f, 'formatters'))
    .filter((name): name is string => Boolean(name))

  const processorNames = processors
    .filter(
      (f) =>
        !f.includes('builtins.gen.ts') && !f.endsWith('/src/processors/index.ts'),
    )
    .map((f) => componentNameFromPath(f, 'processors'))
    .filter((name): name is string => Boolean(name))

  const fixtureNames = new Set(
    testFiles
      .map((f) => f.match(/\/([\w-]+)\.coffee$/)?.[1])
      .filter((name): name is string => Boolean(name)),
  )

  const testedFormatters: string[] = []
  const untestedFormatters: string[] = []
  const testedProcessors: string[] = []
  const untestedProcessors: string[] = []

  for (const formatter of formatterNames) {
    const hasFixture = isCoveredByFixtures(
      formatter,
      fixtureNames,
      FORMATTER_ALIASES,
    )
    if (hasFixture || ERROR_COVERAGE.has(formatter)) {
      testedFormatters.push(formatter)
    } else {
      untestedFormatters.push(formatter)
    }
  }

  for (const processor of processorNames) {
    const hasFixture = isCoveredByFixtures(
      processor,
      fixtureNames,
      PROCESSOR_ALIASES,
    )
    if (hasFixture || ERROR_COVERAGE.has(processor)) {
      testedProcessors.push(processor)
    } else {
      untestedProcessors.push(processor)
    }
  }

  echo('\n' + '='.repeat(60))
  echo('TEST REACHABILITY REPORT')
  echo('='.repeat(60))

  echo(`\n🧭 Formatters (${formatterNames.length} total)`)
  echo(`✅ Reachable: ${testedFormatters.length}/${formatterNames.length}`)
  if (testedFormatters.length > 0) {
    echo(`   ${testedFormatters.join(', ')}`)
  }
  echo(`❌ Unmapped: ${untestedFormatters.length}/${formatterNames.length}`)
  if (untestedFormatters.length > 0) {
    echo(`   ${untestedFormatters.join(', ')}`)
  }

  echo(`\n🧭 Processors (${processorNames.length} total)`)
  echo(`✅ Reachable: ${testedProcessors.length}/${processorNames.length}`)
  if (testedProcessors.length > 0) {
    echo(`   ${testedProcessors.join(', ')}`)
  }
  echo(`❌ Unmapped: ${untestedProcessors.length}/${processorNames.length}`)
  if (untestedProcessors.length > 0) {
    echo(`   ${untestedProcessors.join(', ')}`)
  }

  const totalComponents = formatterNames.length + processorNames.length
  const totalTested = testedFormatters.length + testedProcessors.length
  const summary = `${totalTested}/${totalComponents} mapped`

  echo(`\n🧭 Overall Reachability: ${summary}`)
  echo('='.repeat(60))
  echo('\n')

  return summary
}

export default main
