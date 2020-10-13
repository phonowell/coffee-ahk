# include string

class SystemToolkit extends StringToolkit

  # exit(): void
  exit: -> ExitApp

  # off(key: string, fn: Function | string): void
  off: (key, fn) ->
    key = $.formatHotkey key
    `Hotkey, % key, % fn, Off`

  # on(key, string, fn: Function | string): void
  on: (key, fn) ->
    key = $.formatHotkey key
    `Hotkey, % key, % fn, On`

  # open(source: string): void
  open: (source = '') ->
    unless source
      throw new Error '$.open: invalid source'
    `Run, % source`

  # reload(): void
  reload: -> Reload

  # sleep(time: number): void
  sleep: (time) -> `Sleep, % time`