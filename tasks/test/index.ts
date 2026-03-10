import { echo, glob, write } from 'fire-keeper'

import {
  overwriteFixtureTest,
  pickTarget,
  runFixtureTest,
  showFailures,
  type TestFailure,
} from './helpers.js'

const main = async () => {
  const startTime = Date.now()
  const { target, isOverwrite } = await pickTarget()

  // Run end-to-end tests
  echo('\n' + '='.repeat(60))
  echo('1️⃣  END-TO-END TESTS')
  echo('='.repeat(60))

  const pattern = `./script/test/${target ? target : '*'}.coffee`
  const listSource = (await glob(pattern)).filter((f) => !f.includes('/error-'))

  let passed = 0
  let failed = 0
  const failures: TestFailure[] = []

  // Overwrite mode: 顺序执行所有测试，覆写 fixture
  if (isOverwrite) {
    for (const source of listSource) {
      const success = await overwriteFixtureTest(source)
      success ? passed++ : failed++
    }
  } else {
    // Verify mode: 串行执行所有测试
    for (const source of listSource) {
      const result = await runFixtureTest(source)
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
    showFailures(failures)

    // 输出失败报告
    const failReport = [
      `# Test Report (FAILED) - ${new Date().toISOString()}`,
      `- End-to-end: ${passed}/${listSource.length} (${failed} failed)`,
      `- Failures:`,
      ...failures.map((f) => `  - ${f.source}`),
    ].join('\n')
    await write('./test-report.md', failReport)
    throw new Error(`${failed} end-to-end test(s) failed`)
  }

  echo('✅ All end-to-end tests passed!')

  // overwrite 模式跳过后续测试
  if (isOverwrite) {
    return
  }

  // Run unit tests
  let unitTestCount = 0
  let errorTestCount = 0
  let reachabilitySummary = 'pending'

  echo('\n' + '='.repeat(60))
  echo('2️⃣  UNIT TESTS (Core Models)')
  echo('='.repeat(60))

  const testUnit = await import('./unit.js')
  unitTestCount = await testUnit.default()

  // Run error tests
  echo('\n' + '='.repeat(60))
  echo('3️⃣  ERROR SCENARIO TESTS')
  echo('='.repeat(60))

  const testErrors = await import('./errors.js')
  errorTestCount = await testErrors.default()

  // Run coverage analysis
  echo('\n' + '='.repeat(60))
  echo('4️⃣  REACHABILITY REPORT')
  echo('='.repeat(60))

  const testCoverage = await import('./coverage.js')
  reachabilitySummary = await testCoverage.default()

  // Final summary
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2)
  echo('\n' + '='.repeat(60))
  echo('🎉 ALL TESTS PASSED!')
  echo('='.repeat(60))
  echo(`✅ End-to-end: ${passed}/${listSource.length}`)
  echo(`✅ Unit tests: ${unitTestCount}/${unitTestCount}`)
  echo(`✅ Error scenarios: ${errorTestCount}/${errorTestCount}`)
  echo(`🧭 Reachability: ${reachabilitySummary}`)
  echo(`⏱️  Time: ${elapsed}s`)
  echo('='.repeat(60) + '\n')

  // 输出测试结果到文件
  const report = [
    `# Test Report - ${new Date().toISOString()}`,
    `- End-to-end: ${passed}/${listSource.length}`,
    `- Unit tests: ${unitTestCount}`,
    `- Error scenarios: ${errorTestCount}`,
    `- Reachability: ${reachabilitySummary}`,
    `- Time: ${elapsed}s`,
  ].join('\n')
  await write('./test-report.md', report)
}

export default main
