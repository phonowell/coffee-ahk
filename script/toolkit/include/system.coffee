# include string

class SystemToolkit extends StringToolkit

  # exit(): void
  exit: -> ExitApp

  # off(key: string, fn: string): void
  off: (key, fn) -> `Hotkey, % key, % fn, Off`

  # on(key, string, fn: string): void
  on: (key, fn) -> `Hotkey, % key, % fn, On`

  # reload(): void
  reload: -> Reload

  # sleep(time: number): void
  sleep: (time) -> `Sleep, % time`