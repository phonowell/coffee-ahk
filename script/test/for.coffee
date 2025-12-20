for value in list
  value++
for value, index in list
  value++
for value of map
  value++
for key, value of map
  value++

for a, i in [1, 2, 3]
  for b, j in [3, 2, 1]
    alert i + j

for a in [1, 2, 3]
  for b in [3, 2, 1]
    alert a + b

# === Function context tests ===

# for...of inside function (ctx transform)
fn1 = (obj) ->
  result = ''
  for key, value of obj
    result = "#{result}, #{key}"
  return result

# for-in modifying outer variable
fn2 = ->
  sum = 0
  for x in [1, 2, 3]
    sum += x
  return sum

# for loop with closure capturing
fn3 = ->
  fns = []
  for i in [1, 2, 3]
    fns.push -> i
  return fns

# for with do block (proper capture)
fn4 = ->
  fns = []
  for i in [1, 2, 3]
    do (i) ->
      fns.push -> i
  return fns

# Nested for with closure
fn5 = ->
  result = 0
  for i in [1, 2]
    for j in [3, 4]
      adder = ->
        result += i * j
      adder()
  return result

# for-of with closure modification
fn6 = (data) ->
  output = []
  for key, value of data
    formatter = ->
      return "#{key}=#{value}"
    output.push formatter()
  return output

# for with break in function
fn7 = ->
  last = 0
  for x in [1, 2, 3, 4, 5]
    last = x
    if x == 3
      break
  return last

# for with continue in function
fn8 = ->
  sum = 0
  for x in [1, 2, 3, 4, 5]
    if x == 3
      continue
    sum += x
  return sum