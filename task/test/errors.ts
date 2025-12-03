import { echo } from 'fire-keeper'
import start from '../../src/entry/index.js'

interface ErrorTest {
  name: string
  code: string
  expectedError: RegExp
}

const errorTests: ErrorTest[] = [
  // Forbidden formatter tests (CoffeeScript compiles these, but we reject them)
  {
    name: 'Optional chaining (?.) is forbidden',
    code: 'x = obj?.prop',
    expectedError: /Coffee-AHK\/forbidden.*\?\..*not supported/i,
  },
  {
    name: 'Existential operator (bin?) is forbidden',
    code: 'if bin? then 1',
    expectedError: /Coffee-AHK\/forbidden.*\?.*not supported/i, // CoffeeScript tokenizes as '?'
  },
  {
    name: 'Range operator (..) is forbidden',
    code: 'arr = [1..10]',
    expectedError: /Coffee-AHK\/forbidden.*\.\..*not supported/i,
  },
  {
    name: 'Post-if syntax is forbidden',
    code: 'return 1 if condition',
    expectedError: /Coffee-AHK\/forbidden.*post-if/i,
  },
  {
    name: 'Question mark operator (?) is forbidden',
    code: 'x = a ? b : c',
    expectedError: /Coffee-AHK\/forbidden.*\?.*not supported/i,
  },

  // Operator forbidden tests (CoffeeScript rejects undeclared variable first)
  {
    name: 'Logical OR assignment (||=) requires declaration',
    code: 'x ||= 1',
    expectedError: /can't be assigned.*\|\|=.*not been declared/i,
  },
  {
    name: 'Existential assignment (?=) requires declaration',
    code: 'x ?= 1',
    expectedError: /can't be assigned.*\?=.*not been declared/i,
  },
  {
    name: 'Logical OR assignment (||=) is forbidden even when declared',
    code: 'x = 0\nx ||= 1',
    expectedError: /Coffee-AHK\/forbidden.*\|\|=/i,
  },
  {
    name: 'Existential assignment (?=) is forbidden even when declared',
    code: 'x = 0\nx ?= 1',
    expectedError: /Coffee-AHK\/forbidden.*\?=/i,
  },
  {
    name: 'Logical AND assignment (&&=) is forbidden',
    code: 'x = 1\nx &&= 2',
    expectedError: /Coffee-AHK\/forbidden.*&&=/i,
  },
  {
    name: 'Floor division (//) is forbidden',
    code: 'x = 10 // 3',
    expectedError: /Coffee-AHK\/forbidden.*\/\/.*comment/i,
  },
  {
    name: 'Floor division assignment (//=) is forbidden',
    code: 'x = 10\nx //= 3',
    expectedError: /Coffee-AHK\/forbidden.*\/\/=.*comment/i,
  },
  {
    name: 'Modulo (%%) is forbidden',
    code: 'x = 10 %% 3',
    expectedError: /Coffee-AHK\/forbidden.*%%.*not supported/i,
  },
  {
    name: 'Modulo assignment (%%=) is forbidden',
    code: 'x = 10\nx %%= 3',
    expectedError: /Coffee-AHK\/forbidden.*%%=.*not supported/i,
  },

  // Relation operators forbidden (only 'in' is forbidden, instanceof is supported)
  {
    name: 'in operator is forbidden',
    code: 'x = 1 in [1,2,3]',
    expectedError: /Coffee-AHK\/forbidden.*in.*not supported/i,
  },
  {
    name: 'delete operator is forbidden',
    code: 'delete obj.key',
    expectedError: /Coffee-AHK\/forbidden.*delete.*not supported/i,
  },

  // Number forbidden tests
  {
    name: 'BigInt literal is forbidden',
    code: 'n = 123n',
    expectedError: /Coffee-AHK\/forbidden.*BigInt/i,
  },

  // Sign forbidden tests (spread in wrong context)
  {
    name: 'Spread operator in object literal is forbidden',
    code: 'obj = { ...other }',
    expectedError: /Coffee-AHK\/forbidden.*spread operator/i,
  },

  // Variable name validation
  {
    name: 'Reserved class name is forbidden',
    code: 'class Class\n  a: 1',
    expectedError: /Coffee-AHK\/forbidden.*class name.*reserved/i,
  },
  {
    name: 'AHK built-in function as class name is forbidden',
    code: 'class InStr\n  value: 1',
    expectedError: /Coffee-AHK\/forbidden.*class name.*forbidden/i,
  },
  {
    name: 'Reserved variable name (CoffeeScript error)',
    code: 'return = 1',
    expectedError: /keyword.*can't be assigned|reserved/i,
  },
  {
    name: 'A_ prefix variable name is forbidden',
    code: 'A_Custom = 1',
    expectedError: /Coffee-AHK\/forbidden.*a_.*prefix.*reserved/i,
  },
  {
    name: 'AHK built-in variable in assignment is forbidden',
    code: 'A_Index = 5',
    expectedError: /Coffee-AHK\/forbidden.*A_Index.*a_.*prefix/i,
  },
  {
    name: 'AHK built-in function in assignment is forbidden',
    code: 'InStr = myFunc',
    expectedError: /Coffee-AHK\/forbidden.*InStr.*forbidden list/i,
  },
  {
    name: 'Reserved parameter name (CoffeeScript error)',
    code: 'fn = (return) -> 1',
    expectedError: /unexpected|reserved/i,
  },
  {
    name: 'AHK built-in function as parameter is forbidden',
    code: 'fn = (InStr) -> InStr(a, b)',
    expectedError: /Coffee-AHK\/forbidden.*parameter.*InStr/i,
  },
  {
    name: 'A_ prefix as parameter is forbidden',
    code: 'fn = (A_Index) -> A_Index + 1',
    expectedError: /Coffee-AHK\/forbidden.*parameter.*A_Index/i,
  },
  {
    name: 'Reserved name in destructuring (CoffeeScript error)',
    code: '[return, break] = [1, 2]',
    expectedError: /unexpected|reserved/i,
  },
  {
    name: 'AHK built-in function in array destructuring is forbidden',
    code: '[InStr, x] = arr',
    expectedError: /Coffee-AHK\/forbidden.*array destructuring target.*InStr.*forbidden list/i,
  },
  {
    name: 'A_ prefix in array destructuring is forbidden',
    code: '[A_Index, x] = arr',
    expectedError: /Coffee-AHK\/forbidden.*array destructuring target.*A_Index.*a_.*prefix/i,
  },
  {
    name: 'AHK built-in function as catch variable is forbidden',
    code: 'try\n  x = 1\ncatch InStr\n  console.log(InStr)',
    expectedError: /Coffee-AHK\/forbidden.*catch variable.*InStr/i,
  },
  {
    name: 'A_ prefix as catch variable is forbidden',
    code: 'try\n  x = 1\ncatch A_Index\n  console.log(A_Index)',
    expectedError: /Coffee-AHK\/forbidden.*catch variable.*A_Index/i,
  },
  {
    name: 'AHK built-in function as for loop variable is forbidden',
    code: 'for InStr in arr\n  console.log(InStr)',
    expectedError: /Coffee-AHK\/forbidden.*for loop variable.*InStr/i,
  },
  {
    name: 'A_ prefix as for loop key is forbidden',
    code: 'for A_Index, value in obj\n  console.log(A_Index)',
    expectedError: /Coffee-AHK\/forbidden.*for loop variable.*A_Index/i,
  },
  {
    name: 'A_ prefix as object key is forbidden',
    code: 'obj = {A_Index: 5}',
    expectedError: /Coffee-AHK\/forbidden.*object key.*property.*A_Index.*a_.*prefix/i,
  },
  {
    name: 'A_ prefix as class method name is forbidden',
    code: 'class Animal\n  A_Index: -> 1',
    expectedError: /Coffee-AHK\/forbidden.*object key.*property.*A_Index.*a_.*prefix/i,
  },
  {
    name: 'A_ prefix as destructuring object key is forbidden',
    code: '{A_Index: idx} = obj',
    expectedError: /Coffee-AHK\/forbidden.*(destructuring object key|object key.*property).*A_Index.*a_.*prefix/i,
  },

  // Unsupported language features
  {
    name: 'Unsigned right shift (>>>) is not supported',
    code: 'x = 10 >>> 2',
    expectedError: /Coffee-AHK\/unsupported.*>>>.*not supported/i,
  },
  {
    name: 'await is not supported',
    code: "fn = -> await fetch('url')",
    expectedError: /Coffee-AHK\/unsupported.*await.*not supported/i,
  },
  {
    name: 'yield is not supported',
    code: 'fn = -> yield 1',
    expectedError: /Coffee-AHK\/unsupported.*yield.*not supported/i,
  },
  {
    name: 'for loop destructuring is not supported',
    code: 'for [a, b] in arr\n  a + b',
    expectedError: /Coffee-AHK\/unsupported.*for loop destructuring/i,
  },
  {
    name: 'nested array destructuring is not supported',
    code: '[a, [b, c]] = [1, [2, 3]]',
    expectedError: /Coffee-AHK\/unsupported.*nested array destructuring/i,
  },
  {
    name: 'nested if-then-else expressions are not supported',
    code: 'y = if x > 0 then (if x > 10 then "big" else "small") else "negative"',
    expectedError: /Coffee-AHK\/unsupported.*Nested if-then-else/i,
  },
]

const main = async () => {
  let passed = 0
  let failed = 0
  const failures: string[] = []

  for (const test of errorTests) {
    try {
      // Call the internal entry point directly to avoid error swallowing
      const result = await start(test.code, {
        metadata: false,
        salt: 'ahk',
        comments: false,
        ast: false,
        coffeeAst: false,
        save: false,
        string: false,
        verbose: false,
      })

      // If no error was thrown, the test failed
      failed++
      failures.push(
        `❌ ${test.name}\n   Expected error: ${test.expectedError}\n   But compilation succeeded\n   Result: ${result.content.substring(0, 100)}`,
      )
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)

      if (test.expectedError.test(errorMessage)) {
        passed++
        echo(`✅ ${test.name}`)
      } else {
        failed++
        failures.push(
          `❌ ${test.name}\n   Expected: ${test.expectedError}\n   Got: ${errorMessage.substring(0, 200)}`,
        )
      }
    }
  }

  echo('\n' + '='.repeat(60))
  echo(`Total: ${errorTests.length} | Passed: ${passed} | Failed: ${failed}`)
  echo('='.repeat(60))

  if (failures.length > 0) {
    echo('\nFailures:\n')
    for (const failure of failures) {
      echo(failure + '\n')
    }
    throw new Error(`${failed} error test(s) failed`)
  }

  echo('\n🎉 All error tests passed!')

  return errorTests.length
}

export default main
