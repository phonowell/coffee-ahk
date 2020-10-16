# clearInterval(fn: Function | string): void
clearInterval = (fn) ->
  unless fn then return
  `SetTimer, % fn, Delete`

# clearTimeout(fn: Function | string): void
clearTimeout = (fn) ->
  unless fn then return
  `SetTimer, % fn, Delete`

# setInterval(fn: Function | string, time: number): string
setInterval = (fn, time = 0) ->
  unless fn then return fn
  `SetTimer, % fn, % time`
  return fn

# setTimeout(fn: Function | string, time: number): string
setTimeout = (fn, time = 0) ->
  unless fn then return fn
  `SetTimer, % fn, % 0 - time`
  return fn