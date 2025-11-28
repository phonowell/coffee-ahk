# Destructuring in function context (ctx transform)

# 1. Array destructure in function
fn1 = ->
  [a, b] = [1, 2]
  return a + b

# 2. Array destructure with modification
fn2 = ->
  [x, y] = [1, 2]
  inner = ->
    x = 10
    y = 20
  inner()
  return x + y

# 3. Object destructure in function
fn3 = ->
  {name, age} = {name: 'test', age: 25}
  return "#{name}: #{age}"

# 4. Object destructure with modification
fn4 = ->
  {a, b} = {a: 1, b: 2}
  swap = ->
    temp = a
    a = b
    b = temp
  swap()
  return [a, b]

# 5. Destructure in loop (workaround for unsupported for-loop destructure)
fn5 = ->
  sum = 0
  data = [[1, 2], [3, 4], [5, 6]]
  for item in data
    [a, b] = item
    sum += a + b
  return sum

# 6. Destructure from function call
fn6 = ->
  getData = -> [1, 2, 3]
  [first, second] = getData()
  return first + second

# 7. Multiple destructure statements
fn7 = ->
  [a, b] = [1, 2]
  {x, y} = {x: 3, y: 4}
  return a + b + x + y

# 8. Swap via destructure
fn8 = ->
  a = 1
  b = 2
  [a, b] = [b, a]
  return [a, b]

# 9. Destructure in conditional
fn9 = (flag) ->
  result = 0
  if flag
    [x, y] = [1, 2]
    result = x + y
  return result
