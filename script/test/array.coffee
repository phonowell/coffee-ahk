a = []
a = [1]
a = [1, 2, 3]
a = [
  1
  2
  3
]
a = [
  1
  2, 3
]
a = [
  1
  2, 3
  [1, 2, 3]
]

[a] = [1, 2, 3]
[a, b] = [1, 2, 3]
[a, b, c] = [1, 2, 3]
[a['a'], a.b, a.c] = [1, 2, 3]

d = [1, 2, 3][0]

a[b[c[d]]]

# === Function context tests ===

# Array in function
fn1 = ->
  arr = [1, 2, 3]
  return arr

# Array modification in closure
fn2 = ->
  arr = [1, 2, 3]
  modify = ->
    arr[0] = 10
    arr[1] = 20
  modify()
  return arr

# Array push in closure
fn3 = ->
  arr = []
  addItem = (x) ->
    arr.push x
  addItem 1
  addItem 2
  return arr

# Nested array in function
fn4 = ->
  matrix = [[1, 2], [3, 4]]
  inner = ->
    matrix[0][0] = 99
  inner()
  return matrix

# Array destructure in function
fn5 = ->
  [p, q] = [1, 2]
  swap = ->
    [p, q] = [q, p]
  swap()
  return [p, q]

# Array index with closure variable
fn6 = ->
  arr = [10, 20, 30]
  idx = 1
  getter = ->
    return arr[idx]
  return getter()

# Array literal with closure vars
fn7 = ->
  x = 1
  y = 2
  builder = ->
    return [x, y, x + y]
  return builder()