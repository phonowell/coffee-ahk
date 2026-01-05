# Function mark tests
# Tests src/processors/function/mark.ts
# Marks identifiers followed by parameter-start as 'function' type

# === Function definitions ===
fn1 = -> 1
fn2 = (a) -> a + 1
fn3 = (a, b) -> a * b

# === Function calls (should NOT be marked as function type) ===
result1 = fn1()
result2 = fn2(10)
result3 = fn3(2, 3)

# === Nested functions ===
outer = ->
  inner = -> 42
  inner()

# === Function as parameter ===
apply = (fn) -> fn(1)
apply((x) -> x * 2)

# === Multiple definitions ===
add = (a, b) -> a + b
sub = (a, b) -> a - b
mul = (a, b) -> a * b
