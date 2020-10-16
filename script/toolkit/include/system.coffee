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

# pause(paused?: boolean): void
$.pause = (isPaused = 'Toggle') ->
  if isPaused != 'Toggle'
    if isPaused then isPaused = 'On'
    else isPaused = 'Off'
  `Pause, % isPaused`

# reload(): void
$.reload = -> Reload

# sleep(time: number): void
$.sleep = (time) -> `Sleep, % time`