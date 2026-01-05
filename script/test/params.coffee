# Parameter collection tests
# Tests src/processors/function/ctx-transform/params.ts
# Collects function parameters and detects collisions

# === Basic parameter collection ===
fn1 = (a) -> a
fn2 = (x, y) -> x + y
fn3 = (p, q, r) -> p * q + r

# === Nested functions with different params ===
outer1 = (outerParam) ->
  inner = (innerParam) -> outerParam + innerParam
  inner(10)

# === Multi-level nesting ===
level0 = (a) ->
  level1 = (b) ->
    level2 = (c) -> a + b + c
    level2(3)
  level1(2)

# === Closure parameter sharing ===
outer2 = (sharedParam) ->
  modify = -> sharedParam = sharedParam * 2
  read = -> sharedParam
  modify()
  read()

# === Class method parameters ===
class Calculator
  base: 100

  add: (value) ->
    helper = (multiplier) => @base + value * multiplier
    helper(2)

  compute: (x, y) -> @base + x + y
