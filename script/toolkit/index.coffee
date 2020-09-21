class Toolkit

  abs: (n = 0) -> return Abs n

  alert: (message = '') ->
    `MsgBox % message`
    return message

  beep: -> SoundBeep

  ceil: (n = 0) -> return Ceil n

  click: (input) ->
    unless input
      `Click`
      `return`
    `Click % StrReplace input, ":", " "`

  exit: -> ExitApp

  floor: (n = 0) -> return Floor n

  move: (x = 0, y = 0, speed = 0) ->
    `MouseMove x, y, speed`
    return [x, y, speed]

  now: -> return A_TickCount

  off: (key, fn) -> `Hotkey, key, fn, Off`

  on: (key, fn) -> `Hotkey, key, fn, On`

  random: (min = 0, max = 1) ->
    `Random, __Result__, min, max`
    return __Result__

  reload: -> Reload

  round: (n = 0) -> return Round n

  sleep: (time = 0) -> `Sleep, % time`

  trim: (input = '') -> return `Trim input`

  trimEnd: (input = '') -> return `RTrim input`

  trimStart: (input = '') -> return `LTrim input`

$ = new Toolkit()