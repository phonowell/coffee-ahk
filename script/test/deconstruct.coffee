# Deconstruct test
# Array deconstruct
[a, b] = [1, 2]
[x, y, z] = arr

# Object deconstruct
{name, age} = person
{foo, bar} = obj

# === Function context tests ===

# Array destructure in function
fn1 = ->
  [p, q] = [1, 2]
  return p + q

# Array destructure with closure modification
fn2 = ->
  [s, t] = [1, 2]
  swap = ->
    temp = s
    s = t
    t = temp
  swap()
  return [s, t]

# Object destructure in function
fn3 = ->
  {userName, userAge} = {userName: 'test', userAge: 25}
  return "#{userName}: #{userAge}"

# Object destructure with closure
fn4 = ->
  {m, n} = {m: 1, n: 2}
  modifier = ->
    m = 10
    n = 20
  modifier()
  return m + n

# Destructure from function call
fn5 = ->
  getData = -> [10, 20]
  [first, second] = getData()
  return first + second

# Multiple destructures
fn6 = ->
  [p1, p2] = [1, 2]
  {q1, q2} = {q1: 3, q2: 4}
  calc = ->
    return p1 + p2 + q1 + q2
  return calc()

# Destructure in loop (workaround for unsupported for-loop destructure)
fn7 = ->
  sum = 0
  pairs = [[1, 2], [3, 4]]
  for pair in pairs
    [v1, v2] = pair
    sum += v1 + v2
  return sum
