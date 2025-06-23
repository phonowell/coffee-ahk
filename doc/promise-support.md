# Promise Support Documentation

## Overview

Coffee-AHK now includes comprehensive support for JavaScript-style Promises and async/await syntax. This allows you to write asynchronous code in CoffeeScript that gets transpiled to AutoHotkey.

## Features

### 1. Async Functions

Functions that contain `await` are automatically handled as async functions:

```coffeescript
# CoffeeScript
asyncFunction = ->
  result = await fetch("https://api.example.com")
  return result

# Transpiled to AHK
asyncFunction := Func("ahk_1").Bind(fetch)
ahk_1(fetch) {
  result := await fetch.Call("https://api.example.com")
  return result
}
```

### 2. Promise Constructor

Create new Promises using the standard JavaScript syntax:

```coffeescript
# CoffeeScript
promise = new Promise (resolve, reject) ->
  if condition
    resolve(value)
  else
    reject(error)

# Transpiled to AHK
promise := new Promise(Func("ahk_1").Bind(condition, value, error))
ahk_1(condition, value, error, resolve, reject) {
  if (condition) {
    resolve.Call(value)
  } else {
    reject.Call(error)
  }
}
```

### 3. Promise Static Methods

All major Promise static methods are supported:

```coffeescript
# Promise.resolve
resolved = Promise.resolve(42)
# -> Promise.resolve.Call(42)

# Promise.reject
rejected = Promise.reject(new Error("Failed"))
# -> Promise.reject.Call(Exception("Failed"))

# Promise.all
all = Promise.all([promise1, promise2, promise3])
# -> Promise.all.Call([promise1, promise2, promise3])

# Promise.race
race = Promise.race([promise1, promise2])
# -> Promise.race.Call([promise1, promise2])

# Promise.allSettled
allSettled = Promise.allSettled([promise1, promise2])
# -> Promise.allSettled.Call([promise1, promise2])
```

### 4. Promise Chaining

Method chaining with `.then()`, `.catch()`, and `.finally()` is fully supported:

```coffeescript
# CoffeeScript
promise
  .then (result) ->
    console.log result
    return result * 2
  .catch (error) ->
    console.error error
  .finally ->
    console.log "Done"

# Transpiled to AHK
promise.then.Call(Func("ahk_3").Bind(console))
       .catch.Call(Func("ahk_2").Bind(console))
       .finally.Call(Func("ahk_1").Bind(console))
```

### 5. Await in Different Contexts

The `await` keyword works in various contexts including try/catch blocks:

```coffeescript
# CoffeeScript
fn = ->
  try
    result = await asyncOperation()
    return result
  catch error
    throw error
  finally
    cleanup()

# Transpiled to AHK
fn := Func("ahk_1").Bind(asyncOperation, error, cleanup)
ahk_1(asyncOperation, error, cleanup) {
  try {
    result := await asyncOperation.Call()
    return result
  } catch error {
    throw error
  } finally {
    cleanup.Call()
  }
}
```

### 6. Multiple Awaits

You can use multiple `await` expressions in a single function:

```coffeescript
# CoffeeScript
multipleAwaits = ->
  a = await promiseA()
  b = await promiseB(a)
  c = await promiseC(b)
  return [a, b, c]

# Transpiled to AHK
multipleAwaits := Func("ahk_1").Bind(promiseA, promiseB, promiseC)
ahk_1(promiseA, promiseB, promiseC) {
  a := await promiseA.Call()
  b := await promiseB.Call(a)
  c := await promiseC.Call(b)
  return [a, b, c]
}
```

## Implementation Details

### Transpilation Rules

1. **Promise Constructor**: `new Promise(callback)` becomes `new Promise(Func("...").Bind(...))`
2. **Promise Methods**: `Promise.method()` becomes `Promise.method.Call()`
3. **Promise Chaining**: `.then()`, `.catch()`, `.finally()` become `.method.Call(Func("...").Bind(...))`
4. **Await Expression**: `await expr` becomes `await expr.Call()` (if expr is a function call)
5. **Async Functions**: Functions containing `await` are automatically handled appropriately

### Error Handling

- `Promise.reject()` uses AutoHotkey's `Exception()` constructor
- Try/catch blocks work seamlessly with async functions
- Error parameter names are validated against AutoHotkey reserved words

### Function Binding

Coffee-AHK automatically handles function binding and parameter passing for Promise callbacks, ensuring that closure variables are properly captured and passed to the generated AutoHotkey functions.

## Best Practices

1. **Error Parameters**: Avoid using reserved words like "error" - use "err" instead
2. **Promise Chains**: Keep Promise chains readable by breaking them into multiple lines
3. **Async Functions**: Use async functions for any operation that involves `await`
4. **Error Handling**: Always include proper error handling in Promise chains

## Limitations

1. The current implementation transpiles to AutoHotkey syntax - you'll need an AutoHotkey Promise library for runtime support
2. Some advanced Promise features like `Promise.any()` may need additional implementation
3. Generator functions and async generators are not yet supported

## Testing

The Promise support is thoroughly tested with the test file `script/test/promise.coffee` which covers all major Promise features and use cases.
