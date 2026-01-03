import { echo, glob } from 'fire-keeper'
import { readFileSync } from 'fs'

/**
 * Simple coverage analyzer - counts which source files are tested
 * based on test file names matching source file names
 */

const main = async () => {
  // Get all formatters and processors
  const formatters = await glob('./src/formatters/*.ts')
  const processors = await glob('./src/processors/**/*.ts')
  const testFiles = await glob('./script/test/*.coffee')

  // Also check hardcoded error tests
  const errorTestsContent = readFileSync('./tasks/test/errors.ts', 'utf-8')

  const formatterNames = formatters
    .filter((f) => !f.includes('/index.ts'))
    .map((f) => f.match(/\/(\w+)\.ts$/)?.[1])
    .filter((name): name is string => Boolean(name))

  // Exclude utility files that don't need direct testing
  const utilityFiles = ['utils', 'types', 'cache', 'ignore', 'next']
  const processorNames = processors
    .filter((f) => !f.includes('/index.ts') && !f.includes('builtins.gen.ts'))
    .map((f) => f.match(/\/(\w+)\.ts$/)?.[1])
    .filter((name): name is string => Boolean(name))
    .filter((name) => !utilityFiles.includes(name))

  const testNames = testFiles
    .map((f) => f.match(/\/(\w+)\.coffee$/)?.[1])
    .filter((name): name is string => Boolean(name))

  // Check coverage
  const testedFormatters: string[] = []
  const untestedFormatters: string[] = []
  const testedProcessors: string[] = []
  const untestedProcessors: string[] = []

  for (const formatter of formatterNames) {
    // Check E2E tests and hardcoded error tests
    const hasTest = testNames.includes(formatter) || errorTestsContent.includes(formatter)
    if (hasTest) {
      testedFormatters.push(formatter)
    } else {
      untestedFormatters.push(formatter)
    }
  }

  for (const processor of processorNames) {
    // Check E2E tests, test file content, and hardcoded error tests
    const hasTest = testFiles.some((testFile) => {
      const content = readFileSync(testFile, 'utf-8')
      return content.includes(processor) || testFile.includes(processor)
    }) || errorTestsContent.includes(processor)
    if (hasTest || testNames.includes(processor)) {
      testedProcessors.push(processor)
    } else {
      untestedProcessors.push(processor)
    }
  }

  echo('\n' + '='.repeat(60))
  echo('TEST COVERAGE ANALYSIS')
  echo('='.repeat(60))

  echo(`\n📊 Formatters (${formatterNames.length} total)`)
  echo(`✅ Tested: ${testedFormatters.length}/${formatterNames.length}`)
  if (testedFormatters.length > 0) {
    echo(`   ${testedFormatters.join(', ')}`)
  }
  echo(`❌ Untested: ${untestedFormatters.length}/${formatterNames.length}`)
  if (untestedFormatters.length > 0) {
    echo(`   ${untestedFormatters.join(', ')}`)
  }

  echo(`\n📊 Processors (${processorNames.length} total)`)
  echo(`✅ Covered: ${testedProcessors.length}/${processorNames.length}`)
  if (testedProcessors.length > 0) {
    echo(`   ${testedProcessors.join(', ')}`)
  }
  echo(`❌ Uncovered: ${untestedProcessors.length}/${processorNames.length}`)
  if (untestedProcessors.length > 0) {
    echo(`   ${untestedProcessors.join(', ')}`)
  }

  const totalComponents = formatterNames.length + processorNames.length
  const totalTested = testedFormatters.length + testedProcessors.length
  const coveragePercent = ((totalTested / totalComponents) * 100).toFixed(1)

  echo(`\n📈 Overall Coverage: ${coveragePercent}% (${totalTested}/${totalComponents} components)`)
  echo('='.repeat(60))

  // Recommendations
  echo('\n💡 Recommendations:')
  if (untestedFormatters.length > 0) {
    echo(`   Create tests for formatters: ${untestedFormatters.slice(0, 3).join(', ')}${untestedFormatters.length > 3 ? '...' : ''}`)
  }
  if (untestedProcessors.length > 0) {
    echo(`   Create tests for processors: ${untestedProcessors.slice(0, 3).join(', ')}${untestedProcessors.length > 3 ? '...' : ''}`)
  }
  echo('\n')

  return coveragePercent
}

export default main
