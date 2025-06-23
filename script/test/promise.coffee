# Test for Promise/async functionality

# Basic async function
asyncFn = ->
  await somePromise()

# Async function with parameters
asyncFnWithParams = (a, b) ->
  result = await fetch(a)
  return result + b

# Promise constructor
promise = new Promise (resolve, reject) ->
  if condition
    resolve(value)
  else
    reject(err)

# Promise.resolve
resolved = Promise.resolve(42)

# Promise.reject
rejected = Promise.reject(new Error("Failed"))

# Promise.all
all = Promise.all([
  promise1
  promise2
  promise3
])

# Promise.race
race = Promise.race([
  promise1
  promise2
])

# Promise.allSettled
allSettled = Promise.allSettled([
  promise1
  promise2
])

# Promise chaining
promise
  .then (result) ->
    console.log result
    return result * 2
  .catch (err) ->
    console.error err
  .finally ->
    console.log "Done"

# Await in different contexts
fn = ->
  try
    result = await asyncOperation()
    return result
  catch err
    throw err
  finally
    cleanup()

# Multiple awaits
multipleAwaits = ->
  a = await promiseA()
  b = await promiseB(a)
  c = await promiseC(b)
  return [a, b, c]
