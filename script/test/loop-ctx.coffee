# Loop tests in function context (ctx transform)

# 1. For-in modifying outer variable
fn1 = ->
  sum = 0
  for x in [1, 2, 3]
    sum += x
  return sum

# 2. For-of modifying outer variable
fn2 = (obj) ->
  result = ''
  for k, v of obj
    result = result + k + v
  return result

# 3. Nested for loops with outer modification
fn3 = ->
  total = 0
  for i in [1, 2]
    for j in [3, 4]
      total += i * j
  return total

# 4. For loop with closure capturing loop var
fn4 = ->
  fns = []
  for i in [1, 2, 3]
    fns.push -> i
  return fns

# 5. For loop with do block capturing
fn5 = ->
  fns = []
  for i in [1, 2, 3]
    do (i) ->
      fns.push -> i
  return fns

# 6. While loop modifying outer
fn6 = ->
  count = 0
  i = 0
  while i < 5
    count += i
    i++
  return count

# 7. While with inner function
fn7 = ->
  result = []
  i = 0
  while i < 3
    fn = -> i
    result.push fn
    i++
  return result

# 8. For loop with break and outer var
fn8 = ->
  lastValue = 0
  for x in [1, 2, 3, 4, 5]
    lastValue = x
    if x == 3
      break
  return lastValue

# 9. For loop with continue and outer var
fn9 = ->
  sum = 0
  for x in [1, 2, 3, 4, 5]
    if x == 3
      continue
    sum += x
  return sum

# 10. Loop variable used in nested function
fn10 = ->
  handlers = []
  for item in ['a', 'b', 'c']
    handler = ->
      return "processing #{item}"
    handlers.push handler
  return handlers

# 11. For-of with complex value processing
fn11 = (data) ->
  output = []
  for key, value of data
    formatter = ->
      return "#{key}: #{value}"
    output.push formatter()
  return output

# 12. Multiple loops sharing outer variable
fn12 = ->
  counter = 0
  for x in [1, 2]
    counter += x
  for y in [3, 4]
    counter += y
  return counter

# 13. Loop with object modification
fn13 = ->
  obj = {sum: 0}
  for x in [1, 2, 3]
    obj.sum += x
  return obj.sum

# 14. Loop with array modification
fn14 = ->
  arr = []
  for i in [1, 2, 3]
    arr.push i * 2
  return arr
