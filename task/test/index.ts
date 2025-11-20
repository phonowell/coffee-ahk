import { argv, echo, glob, read, write } from 'fire-keeper'

import c2aViaJs from '../../dist/index.js'
import c2aViaTs from '../../src/index.js'

const compile = async (source: string) =>
  (
    (await c2aViaTs(source, {
      metadata: false,
      salt: 'ahk',
      save: false,
    })) ?? ''
  )
    .replace(/\r/g, '')
    .trim()

const compile2 = async (source: string) =>
  (
    (await c2aViaJs(source, {
      metadata: false,
      salt: 'ahk',
      save: false,
    })) ?? ''
  )
    .replace(/\r/g, '')
    .trim()

const main = async () => {
  const target = await pickTarget()

  // Run end-to-end tests
  echo('\n' + '='.repeat(60))
  echo('1️⃣  END-TO-END TESTS')
  echo('='.repeat(60))

  const pattern = `./script/test/${
    !!target && target !== 'overwrite' ? target : '*'
  }.coffee`

  const listSource = await glob(pattern)

  let passed = 0
  let failed = 0
  const failures: Array<{
    source: string
    turn: number
    actual: string
    expected: string
  }> = []

  // Parallel execution for non-overwrite mode
  if (target === 'overwrite') {
    // Sequential for overwrite mode
    for (const source of listSource) {
      const target2 = source.replace('.coffee', '.ahk')
      const content = await compile(source)
      await write(target2, content)
      passed++
    }
  } else {
    // Parallel execution
    const results = await Promise.all(
      listSource.map(async (source) => {
        const target2 = source.replace('.coffee', '.ahk')

        const content = await compile(source)
        const contentTarget = ((await read(target2)) ?? '')
          .toString()
          .replace(/\r/g, '')
          .trim()

        if (content !== contentTarget) {
          return {
            source,
            turn: 1,
            actual: content,
            expected: contentTarget,
          }
        }

        const content2 = await compile2(source)
        if (content2 !== contentTarget) {
          return {
            source,
            turn: 2,
            actual: content2,
            expected: contentTarget,
          }
        }

        return null // Passed
      }),
    )

    // Collect results
    for (const result of results) {
      if (result === null) {
        passed++
      } else {
        failed++
        failures.push(result)
      }
    }
  }

  echo(`Total: ${listSource.length} | Passed: ${passed} | Failed: ${failed}`)

  if (failures.length > 0) {
    echo('\nFailures:\n')
    for (const failure of failures) {
      echo(`❌ ${failure.source} (TURN ${failure.turn})`)
      echo('Actual output:')
      echo(failure.actual.substring(0, 300))
      echo('\n---EXPECTED---')
      echo(failure.expected.substring(0, 300))
      echo('\n')
    }
    throw new Error(`${failed} end-to-end test(s) failed`)
  }

  echo('✅ All end-to-end tests passed!')

  // If overwrite mode, skip additional tests
  if (target === 'overwrite') {
    return
  }

  // Run unit tests (if not in overwrite mode)
  let unitTestCount = 0
  let errorTestCount = 0
  let coveragePercent = '0.0'

  echo('\n' + '='.repeat(60))
  echo('2️⃣  UNIT TESTS (Core Models)')
  echo('='.repeat(60))

  try {
    const testUnit = await import('./unit.js')
    unitTestCount = await testUnit.default()
  } catch (error) {
    echo('❌ Unit tests failed')
    throw error
  }

  // Run error tests
  echo('\n' + '='.repeat(60))
  echo('3️⃣  ERROR SCENARIO TESTS')
  echo('='.repeat(60))

  try {
    const testErrors = await import('./errors.js')
    errorTestCount = await testErrors.default()
  } catch (error) {
    echo('❌ Error tests failed')
    throw error
  }

  // Run coverage analysis
  echo('\n' + '='.repeat(60))
  echo('4️⃣  COVERAGE ANALYSIS')
  echo('='.repeat(60))

  try {
    const testCoverage = await import('./coverage.js')
    coveragePercent = await testCoverage.default()
  } catch (error) {
    echo('❌ Coverage analysis failed')
    throw error
  }

  // Final summary
  echo('\n' + '='.repeat(60))
  echo('🎉 ALL TESTS PASSED!')
  echo('='.repeat(60))
  echo(`✅ End-to-end: ${passed}/${listSource.length}`)
  echo(`✅ Unit tests: ${unitTestCount}/${unitTestCount}`)
  echo(`✅ Error scenarios: ${errorTestCount}/${errorTestCount}`)
  echo(`📊 Coverage: ${coveragePercent}%`)
  echo('='.repeat(60) + '\n')
}

const pickTarget = async () => {
  const a = await argv()
  return a._[1] ?? a.target
}

export default main
