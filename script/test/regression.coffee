# Regression coverage for review findings

# top-level for closure captures the loop var
for rv in [1, 2]
  cbFor = -> rv

# top-level for..of closure captures key and value
for rk, rv2 of {a: 1}
  cbOf = -> rk + rv2

# top-level catch closure captures the error var
try
  mayFail()
catch rerr
  cbCatch = -> rerr

# assignment inside a top-level block stays global
if flagA
  inner = 1

# empty-param fat arrow must not emit a trailing comma
fat = () => @x

# multiline else-if expression compiles to nested ternary
tier = if scoreA
  1
else if scoreB
  2
else
  3

# if expression without else falls back to ""
maybe = if flagA
  1

# || chains keep the first truthy operand
conf = port || host || "localhost"

# a function default param must not steal the outer implicit return
withCb = (cb = -> 1) -> cb()

# heredoc keeps embedded newlines
doc = """line1
line2"""

# import-looking text inside heredoc/comments is not a real import
fake = """
import ghost from './no-such-file'
"""
###
import alsoGhost from './no-such-file-2'
###

# export {} is a legal no-op
export {}

# named import from a class-only module resolves to the class
import { OnlyKlass } from './includes/only-class'
okInst = new OnlyKlass()

# side-effect import of an export {} module
import './includes/noop'

# && with a literal fallback keeps the value, not a boolean
andVal = flagA && "yes"
andDeep = flagA && flagB && "deep"

# `return if` compiles to a returned ternary
retIf = ->
  return if flagA
    1
  else
    2

# a function-tail if returns the branch value
tailIf = ->
  if flagA
    3
  else
    4

# a nested tail if pushes return into the inner branches
tailNest = ->
  if flagA
    if flagB
      5

# a multi-statement tail branch returns its last expression
tailMulti = ->
  if flagA
    tmp = 1
    tmp + 1

# tail unless returns the branch value
tailUnless = -> unless flagA then 6 else 7

# do with params passes outer values / default exprs as call args
doRes = do (dv) -> dv * 2
doDef = do (da, db = 2) -> da + db

# commas inside a nested call must not truncate the do-arg list
doNest = do (dn = Math.max(1, 2), dn2 = f(3, 4)) -> dn + dn2

# chained assignment registers inner targets as globals for closures
chainA = chainB = 1
chainCb = -> chainB

# super() in a method calls the parent method of the same name
class RegBase
  speak: -> "base"
class RegChild extends RegBase
  constructor: ->
    super()
  speak: ->
    super(1)

# multi-line object literal with braces keeps the entry separator
bracedObj = {k1: 1
  k2: 2}
