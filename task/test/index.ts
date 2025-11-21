import { argv, echo, glob, isExist, read, write } from 'fire-keeper'

import c2aViaJs from '../../dist/index.js'
import c2aViaTs from '../../src/index.js'

// 检查dist是否存在
const checkDist = async () => {
  if (!(await isExist('./dist/index.js'))) {
    throw new Error('dist/index.js not found. Run "pnpm build" first.')
  }
}

const TIMEOUT_MS = 10000 // 10 seconds per test

const withTimeout = <T>(promise: Promise<T>, ms: number, name: string): Promise<T> =>
  Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout: ${name} exceeded ${ms}ms`)), ms)
    ),
  ])

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
  await checkDist()
  const startTime = Date.now()
  const target = await pickTarget()

  // Run end-to-end tests
  echo('\n' + '='.repeat(60))
  echo('1️⃣  END-TO-END TESTS')
  echo('='.repeat(60))

  const pattern = `./script/test/${
    !!target && target !== 'overwrite' ? target : '*'
  }.coffee`

  const listSource = (await glob(pattern)).filter(f => !f.includes('/error-'))

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
      const content = await withTimeout(compile(source), TIMEOUT_MS, source)
      if (!content) {
        echo(`⚠️ Empty output: ${source}`)
        failed++
        continue
      }
      await write(target2, content)
      passed++
    }
  } else {
    // Parallel execution
    const results = await Promise.all(
      listSource.map(async (source) => {
        const target2 = source.replace('.coffee', '.ahk')

        const content = await withTimeout(compile(source), TIMEOUT_MS, source)
        const contentTarget = ((await read(target2)) ?? '')
          .toString()
          .replace(/\r/g, '')
          .trim()

        // 防止空值假阳性：编译结果或fixture为空时报错
        if (!content || !contentTarget) {
          return {
            source,
            turn: 1,
            actual: content || '(empty)',
            expected: contentTarget || '(empty fixture)',
          }
        }

        if (content !== contentTarget) {
          return {
            source,
            turn: 1,
            actual: content,
            expected: contentTarget,
          }
        }

        const content2 = await withTimeout(compile2(source), TIMEOUT_MS, source)
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
      // Show line-by-line diff
      const actualLines = failure.actual.split('\n')
      const expectedLines = failure.expected.split('\n')
      const maxLines = Math.max(actualLines.length, expectedLines.length)
      echo('--- DIFF (- expected, + actual) ---')
      for (let i = 0; i < Math.min(maxLines, 20); i++) {
        const a = actualLines[i] ?? ''
        const e = expectedLines[i] ?? ''
        if (a !== e) {
          if (e) echo(`- L${i + 1}: ${e}`)
          if (a) echo(`+ L${i + 1}: ${a}`)
        }
      }
      if (maxLines > 20) echo(`... and ${maxLines - 20} more lines`)
      echo('')
    }
    // 失败时也输出报告
    const failReport = [
      `# Test Report (FAILED) - ${new Date().toISOString()}`,
      `- End-to-end: ${passed}/${listSource.length} (${failed} failed)`,
      `- Failures:`,
      ...failures.map(f => `  - ${f.source}`),
    ].join('\n')
    await write('./test-report.md', failReport)
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
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2)
  echo('\n' + '='.repeat(60))
  echo('🎉 ALL TESTS PASSED!')
  echo('='.repeat(60))
  echo(`✅ End-to-end: ${passed}/${listSource.length}`)
  echo(`✅ Unit tests: ${unitTestCount}/${unitTestCount}`)
  echo(`✅ Error scenarios: ${errorTestCount}/${errorTestCount}`)
  echo(`📊 Coverage: ${coveragePercent}%`)
  echo(`⏱️  Time: ${elapsed}s`)
  echo('='.repeat(60) + '\n')

  // 输出测试结果到文件
  const report = [
    `# Test Report - ${new Date().toISOString()}`,
    `- End-to-end: ${passed}/${listSource.length}`,
    `- Unit tests: ${unitTestCount}`,
    `- Error scenarios: ${errorTestCount}`,
    `- Coverage: ${coveragePercent}%`,
    `- Time: ${elapsed}s`,
  ].join('\n')
  await write('./test-report.md', report)
}

const pickTarget = async () => {
  const a = await argv()
  return a._[1] ?? a.target
}

export default main
