# clearInterval(fn: Function | string): void
clearInterval = (fn) -> `SetTimer, % fn, Delete`

# clearTimeout(fn: Function | string): void
clearTimeout = (fn) -> `SetTimer, % fn, Delete`

# setInterval(fn: Function | string, time: number): string
setInterval = (fn, time) ->
  `SetTimer, % fn, % time`
  return fn

# setTimeout(fn: Function | string, time: number): string
setTimeout = (fn, time) ->
  `SetTimer, % fn, % 0 - time`
  return fn