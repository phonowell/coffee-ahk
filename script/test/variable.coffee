a = 1
a = 2

fn = ->
  b = 1
  b = 2

c = 1
c = 2
fn = -> c = 3

[a, b] = [1, 2]
[a] = [1, 2, 3]
[a, b] = list
[a, b] = fn()

fn = -> [a, b, c] = [1, 2, 3]

# === Function context tests (closure) ===

# Inner function modifies outer variable
fn1 = ->
  x = 1
  inner = -> x = 2
  inner()
  return x

# Multiple variables with closure
fn2 = ->
  p = 1
  q = 2
  modifier = ->
    p = 10
    q = 20
  modifier()
  return p + q

# Nested closure modification
fn3 = ->
  x = 0
  level1 = ->
    level2 = ->
      x = 99
    level2()
  level1()
  return x

# Variable shadowing test
fn4 = ->
  outer = 'outer'
  inner = ->
    outer = 'modified'  # modifies outer, not shadow
  inner()
  return outer

# Compound assignment in closure
fn5 = ->
  count = 0
  increment = ->
    count += 1
    count *= 2
  increment()
  return count

# Multiple assignment targets
fn6 = ->
  m = n = o = 1
  modifier = ->
    m = n = o = 9
  modifier()
  return m + n + o

# Parameter modification
fn7 = (x) ->
  modifier = ->
    x = x * 2
  modifier()
  return x

# Array element as variable
fn8 = ->
  arr = [1, 2, 3]
  modifier = ->
    arr[0] = 100
  modifier()
  return arr[0]