# Bind transformation tests
# Tests src/processors/function/ctx-transform/bind.ts
# Adds .Bind(λ) for closures, .Bind({}) at top level

# === Top-level function (no closure) ===
topLevel = ->
  inner = -> 42
  inner()

# === Single-level closure ===
outer1 = ->
  x = 1
  inner = -> x + 1
  inner()

# === Multi-level closure ===
outer2 = ->
  a = 1
  level1 = ->
    b = 2
    level2 = -> a + b
    level2()
  level1()

# === Multiple inner functions ===
outer3 = ->
  value = 10
  add = -> value + 1
  mul = -> value * 2
  add() + mul()

# === Closure in loop ===
outer4 = ->
  for i in [1, 2, 3]
    fn = -> i
    fn()

# === Class method with this ===
class Counter
  count: 0

  increment: ->
    helper = => @count += 1
    helper()

  getValue: -> @count
