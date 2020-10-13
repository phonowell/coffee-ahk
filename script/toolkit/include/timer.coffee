# include system

class TimerToolkit extends SystemToolkit

  # clearInterval(fn: Function | string): void
  clearInterval: (fn) -> `SetTimer, % fn, Delete`

  # clearTimeout(fn: Function | string): void
  clearTimeout: (fn) -> `SetTimer, % fn, Delete`

  # setInterval(fn: Function | string, time: number): void
  setInterval: (fn, time) -> `SetTimer, % fn, % time`

  # setTimeout(fn: Function | string, time: number): void
  setTimeout: (fn, time) -> `SetTimer, % fn, % 0 - time`