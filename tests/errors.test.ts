import { describe, expect, test } from 'vitest'

import start from '../src/entry/index.js'
import { parseExportsFromCoffee } from '../src/file/include/transformer/parse-exports.js'

import { compileFixture } from './helpers.js'

const compile = (code: string) =>
  start(code, {
    metadata: false,
    salt: 'ahk',
    comments: false,
    ast: false,
    coffeeAst: false,
    save: false,
    string: false,
    verbose: false,
  })

const errorTests: [name: string, code: string, expectedError: RegExp][] = [
  [
    'Optional chaining (?.) is forbidden',
    'x = obj?.prop',
    /Coffee-AHK\/forbidden.*\?\..*not supported/i,
  ],
  [
    'Range operator (..) is forbidden',
    'arr = [1..10]',
    /Coffee-AHK\/forbidden.*\.\..*not supported/i,
  ],
  ['Post-if syntax is forbidden', 'return 1 if condition', /Coffee-AHK\/forbidden.*post-if/i],
  ['Logical OR assignment (||=) is forbidden', 'x = 0\nx ||= 1', /Coffee-AHK\/forbidden.*\|\|=/i],
  ['Floor division (//) is forbidden', 'x = 10 // 3', /Coffee-AHK\/forbidden.*\/\/.*comment/i],
  ['in operator is forbidden', 'x = 1 in [1,2,3]', /Coffee-AHK\/forbidden.*in.*not supported/i],
  [
    'delete operator is forbidden',
    'delete obj.key',
    /Coffee-AHK\/forbidden.*delete.*not supported/i,
  ],
  ['BigInt literal is forbidden', 'n = 123n', /Coffee-AHK\/unsupported.*BigInt/i],
  [
    'Spread operator in object literal is forbidden',
    'obj = { ...other }',
    /Coffee-AHK\/forbidden.*spread operator/i,
  ],
  [
    'AHK built-in function as class name is forbidden',
    'class InStr\n  value: 1',
    /Coffee-AHK\/forbidden.*class name.*forbidden/i,
  ],
  [
    'A_ prefix in assignment is forbidden',
    'A_Index = 5',
    /Coffee-AHK\/forbidden.*A_Index.*a_.*prefix/i,
  ],
  [
    'AHK built-in function as parameter is forbidden',
    'fn = (InStr) -> InStr(a, b)',
    /Coffee-AHK\/forbidden.*parameter.*InStr/i,
  ],
  [
    'A_ prefix parameter late in the list is forbidden',
    'fn = (a, b, c, d, e, f, A_Index) -> a',
    /Coffee-AHK\/forbidden.*parameter.*A_Index/i,
  ],
  [
    'A_ prefix in array destructuring is forbidden',
    '[A_Index, x] = arr',
    /Coffee-AHK\/forbidden.*array destructuring target.*A_Index.*a_.*prefix/i,
  ],
  [
    'A_ prefix as catch variable is forbidden',
    'try\n  x = 1\ncatch A_Index\n  console.log(A_Index)',
    /Coffee-AHK\/forbidden.*catch variable.*A_Index/i,
  ],
  [
    'await is not supported',
    "fn = -> await fetch('url')",
    /Coffee-AHK\/unsupported.*await.*not supported/i,
  ],
  [
    'for loop destructuring is not supported',
    'for [a, b] in arr\n  a + b',
    /Coffee-AHK\/unsupported.*for loop destructuring/i,
  ],
  [
    'nested array destructuring is not supported',
    '[a, [b, c]] = [1, [2, 3]]',
    /Coffee-AHK\/unsupported.*nested array destructuring/i,
  ],
  [
    'Single-letter class name is forbidden',
    'class A\n  a: 1',
    /Coffee-AHK\/class-error.*class name.*A.*single letter/i,
  ],
  [
    '@property in constructor parameters is forbidden',
    'class Animal\n  constructor: (@name) ->',
    /Coffee-AHK\/syntax-error.*this\.name.*constructor parameters/i,
  ],
  [
    'postfix for loop is not supported',
    'alert(x) for x in [1, 2]',
    /Coffee-AHK\/unsupported.*postfix.*comprehension.*for/i,
  ],
  [
    'for comprehension is not supported',
    'sq = (v * 2 for v in [1, 2])',
    /Coffee-AHK\/unsupported.*postfix.*comprehension.*for/i,
  ],
  [
    'for when modifier is not supported',
    'for y in [1, 2] when y > 1\n  log(y)',
    /Coffee-AHK\/unsupported.*for-loop modifier.*when/i,
  ],
  [
    'for by modifier is not supported',
    'for z in arr by 2\n  log(z)',
    /Coffee-AHK\/unsupported.*for-loop modifier.*by/i,
  ],
  [
    'for own modifier is not supported',
    'for own k, v of obj\n  log(k)',
    /Coffee-AHK\/unsupported.*for-loop modifier.*own/i,
  ],
  [
    'for object destructuring target is not supported',
    'for {a, b} in arr\n  log(a)',
    /Coffee-AHK\/unsupported.*for loop destructuring|non-identifier/i,
  ],
  ['postfix while is not supported', 'x++ while x < 5', /Coffee-AHK\/unsupported.*postfix.*while/i],
  ['postfix until is not supported', 'y++ until y > 3', /Coffee-AHK\/unsupported.*postfix.*until/i],
  [
    'if-expression inside call arguments is not supported',
    'r = f(if h then 8 else 9)',
    /Coffee-AHK\/unsupported.*if-expression in this position/i,
  ],
  [
    'if-expression inside array literal is not supported',
    'arr = [if i then 10 else 11]',
    /Coffee-AHK\/unsupported.*if-expression in this position/i,
  ],
  [
    'try in expression position is not supported',
    't = try mayFail() catch e then 1',
    /Coffee-AHK\/unsupported.*'try' in expression position/i,
  ],
  [
    'switch in expression position is not supported',
    's = switch x\n  when 1 then 10\n  else 20',
    /Coffee-AHK\/unsupported.*'switch' in expression position/i,
  ],
  ['regex literal is not supported', 'r = ///a|b///', /Coffee-AHK\/unsupported.*regex literal/i],
  [
    'spread of member expression is not supported',
    'x = f(...a.b)',
    /Coffee-AHK\/unsupported.*spread of a member/i,
  ],
  [
    'spread of call result is not supported',
    'x = f(...g())',
    /Coffee-AHK\/unsupported.*spread operand must be a plain variable/i,
  ],
  [
    'spread of binary expression is not supported',
    'x = f(...a + b)',
    /Coffee-AHK\/unsupported.*spread operand must be a plain variable/i,
  ],
  [
    'spread of parenthesized expression is not supported',
    'x = f(...(a))',
    /Coffee-AHK\/unsupported.*spread operand must be a plain variable/i,
  ],
  [
    'class as object value is not supported',
    'x = {k: class Yz}',
    /Coffee-AHK\/unsupported.*'class' in expression position/i,
  ],
  [
    'debugger statement is not supported',
    'f = ->\n  debugger',
    /Coffee-AHK\/unsupported.*'debugger'/i,
  ],
  [
    'arguments object is not supported',
    'f = -> arguments',
    /Coffee-AHK\/unsupported.*'arguments'/i,
  ],
  ['eval is not supported', 'e = eval("1+1")', /Coffee-AHK\/unsupported.*'eval'/i],
  ['Infinity literal is not supported', 'inf = Infinity', /Coffee-AHK\/unsupported.*Infinity/i],
  [
    'object destructuring parameter is not supported',
    'f = ({a, b}) -> a + b',
    /Coffee-AHK\/unsupported.*object destructuring in parameters/i,
  ],
  [
    'array destructuring parameter is not supported',
    'f = ([a, b]) -> a + b',
    /Coffee-AHK\/unsupported.*array destructuring in parameters/i,
  ],
  [
    'non-final rest parameter is not supported',
    'f = (a..., b) -> a',
    /Coffee-AHK\/unsupported.*rest parameter must be the last/i,
  ],
  [
    'class in expression position is not supported',
    'x = class Named\n  m: -> 1',
    /Coffee-AHK\/unsupported.*'class' in expression position/i,
  ],
  [
    'class in tail position is not supported',
    'f = ->\n  class Inner\n    m: -> 1',
    /Coffee-AHK\/unsupported.*'class' block in tail position/i,
  ],
  [
    'throw in expression position is not supported',
    'x = throw e',
    /Coffee-AHK\/unsupported.*'throw' in expression position/i,
  ],
]

describe('error scenarios', () => {
  test.each(errorTests)('%s', async (_name, code, expectedError) => {
    await expect(compile(code)).rejects.toThrow(expectedError)
  })

  test('duplicate export default is rejected', () => {
    expect(() => parseExportsFromCoffee('export default 1\nexport default 2')).toThrow(
      /duplicate 'export default'/i,
    )
  })

  test('default import from a module without default export is rejected', async () => {
    await expect(compileFixture('script/test/error-default-import.coffee')).rejects.toThrow(
      /no default export/i,
    )
  })
})
