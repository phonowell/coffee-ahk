do -> 1
fn = -> 2
do fn
a = do -> 3
b = c: do -> 4
d = do -> do -> -> 5
do -> if a > 1 then a = 1 else a = 0
do -> switch a > 1
  when 1 then a = 0
do -> for a in [1, 2]
  a++
do -> return 1

# === Function context tests ===

# do with closure modification
fn1 = ->
  x = 1
  do ->
    x = 2
  return x

# do with parameter capturing
fn2 = ->
  fns = []
  for i in [1, 2, 3]
    do (i) ->
      fns.push -> i
  return fns

# Nested do with closure
fn3 = ->
  result = 0
  do ->
    do ->
      result = 42
  return result

# do returning function with closure
fn4 = ->
  x = 10
  getter = do ->
    -> x
  return getter()

# do modifying outer in condition
fn5 = ->
  value = 'initial'
  flag = true
  if flag
    do ->
      value = 'modified'
  return value

# do in loop with closure
fn6 = ->
  sum = 0
  for i in [1, 2, 3]
    do ->
      sum += i
  return sum

# do with immediate execution
fn7 = ->
  counter = 0
  increment = do ->
    counter += 1
    -> counter += 1
  increment()
  return counter

# do accessing outer variables
fn8 = ->
  m = 1
  n = 2
  result = do ->
    m + n
  return result