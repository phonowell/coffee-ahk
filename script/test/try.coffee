try
  1
catch
  2
try 1
catch e then 2
finally 3
fn = ->
  try alert 1
  catch e then throw e

# === Function context tests ===

# try-catch modifying outer variable
fn1 = ->
  result = 'initial'
  try
    result = 'try block'
  catch e
    result = 'catch block'
  return result

# try with closure
fn2 = ->
  value = 0
  try
    setter = ->
      value = 42
    setter()
  catch e
    value = -1
  return value

# catch block modifying outer
fn3 = ->
  status = 'ok'
  try
    throw 'error'
  catch e
    handler = ->
      status = 'error caught'
    handler()
  return status

# finally with closure
fn4 = ->
  cleanup = false
  try
    x = 1
  finally
    finalizer = ->
      cleanup = true
    finalizer()
  return cleanup

# Nested try with closure
fn5 = ->
  level = 0
  try
    level = 1
    try
      setter = ->
        level = 2
      setter()
    catch inner
      level = -2
  catch outer
    level = -1
  return level

# try-catch-finally all with closure
fn6 = ->
  logArr = []
  try
    adder = -> logArr.push 'try'
    adder()
  catch e
    adder = -> logArr.push 'catch'
    adder()
  finally
    adder = -> logArr.push 'finally'
    adder()
  return logArr