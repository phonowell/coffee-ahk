# include system

class TimerToolkit extends SystemToolkit

  # clearInterval(fn: string): void
  clearInterval: (fn) -> `SetTimer, % fn, Delete`

  # clearTimeout(fn: string): void
  clearTimeout: (fn) -> `SetTimer, % fn, Delete`

  # setInterval(fn: string, time: number): void
  setInterval: (fn, time) -> `SetTimer, % fn, % time`

  # setTimeout(fn, string, time: number): void
  setTimeout: (fn, time) -> `SetTimer, % fn, % 0 - time`