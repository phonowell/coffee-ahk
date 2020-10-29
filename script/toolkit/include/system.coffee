# exit(): void
$.exit = -> ExitApp

# off(key: string, fn: Function | string): void
$.off = (key, fn) ->
  key = $.formatHotkey key
  `Hotkey, % key, % fn, Off`

# on(key, string, fn: Function | string): void
$.on = (key, fn) ->
  key = $.formatHotkey key
  `Hotkey, % key, % fn, On`

# open(source: string): void
$.open = (source) -> `Run, % source`

# reload(): void
$.reload = -> Reload

# sleep(time: number): void
$.sleep = (time) -> `Sleep, % time`

# suspend(suspended?: boolean): void
$.suspend = (isSuspended = 'Toggle') ->
  if isSuspended != 'Toggle'
    if isSuspended then isSuspended = 'On'
    else isSuspended = 'Off'
  `Suspend, % isSuspended`