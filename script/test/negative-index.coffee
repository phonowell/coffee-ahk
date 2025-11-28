# Negative indexing (Python-style)
# arr[-1] → arr[arr.Length()]
# arr[-2] → arr[arr.Length() - 1]

arr = [1, 2, 3]

# === READ ACCESS ===
last = arr[-1]
secondLast = arr[-2]
third = arr[-3]

# === WRITE ACCESS ===
arr[-1] = 999
arr[-2] = 888

# With property chain
obj = { items: [1, 2, 3] }
obj.items[-1] = 100

# === CHAINED INDEX (now supported!) ===
nested = [[1, 2], [3, 4]]
val = nested[0][-1]
val2 = nested[1][-2]

# Deep chaining
matrix = [[[1, 2], [3, 4]], [[5, 6], [7, 8]]]
deep = matrix[0][1][-1]

# === Function context tests ===

# Negative index in function
fn1 = ->
  arr = [1, 2, 3]
  return arr[-1]

# Negative index with closure
fn2 = ->
  arr = [10, 20, 30]
  getLast = ->
    return arr[-1]
  return getLast()

# Negative index write in closure
fn3 = ->
  arr = [1, 2, 3]
  setLast = (v) ->
    arr[-1] = v
  setLast 99
  return arr

# Chained negative index in function
fn4 = ->
  nested = [[1, 2], [3, 4]]
  inner = ->
    return nested[0][-1]
  return inner()

# Negative index with variable
fn5 = ->
  arr = [1, 2, 3, 4, 5]
  idx = -2
  getter = ->
    return arr[idx]
  return getter()

# Multiple negative index operations
fn6 = ->
  arr = [10, 20, 30, 40]
  first = arr[-4]
  last = arr[-1]
  calc = ->
    return first + last
  return calc()
