class Toolkit

  abs: (n) -> return Abs n

  alert: (message) ->
    `MsgBox, % message`
    return message

  beep: -> SoundBeep

  ceil: (n) -> return Ceil n

  clearInterval: (name) -> `SetTimer, % name, Delete`

  clearTimeout: (name) -> `SetTimer, % name, Delete`

  click: (input) ->
    unless input
      `Click`
      `return`
    `Click, % StrReplace input, ":", " "`

  exit: -> ExitApp

  floor: (n) -> return Floor n

  getColor: (x = -1, y = -1) ->
    unless x >= 0 and y >= 0
      position = $.getPosition()
      x = position[1]
      y = position[2]
    `PixelGetColor, __Result__, % x, % y, RGB`
    return __Result__

  getPosition: ->
    `MouseGetPos, __X__, __Y__`
    return [__X__, __Y__]

  info: (message, x = -1, y = -1) ->
    unless x >= 0 and y >= 0
      position = $.getPosition()
      x = position[1]
      y = position[2]
    `ToolTip, % message, % x, % y`
    return message

  move: (x = 0, y = 0, speed = 0) ->
    `MouseMove, x, y, speed`
    return [x, y, speed]

  now: -> return A_TickCount

  off: (key, fn) -> `Hotkey, % key, % fn, Off`

  on: (key, fn) -> `Hotkey, % key, % fn, On`

  random: (min = 0, max = 1) ->
    `Random, __Result__, min, max`
    return __Result__

  reload: -> Reload

  replace: (input, searchment, replacement, limit = -1) ->
    return StrReplace input, searchment, replacement, limit

  round: (n) -> return Round n

  setInterval: (name, time) -> `SetTimer, % name, % time`

  setTimeout: (name, time) -> `SetTimer, % name, % 0 - time`

  sleep: (time) -> `Sleep, % time`

  toLowerCase: (input) ->
    `StringLower, __Result__, input`
    return __Result__

  toUpperCase: (input) ->
    `StringUpper, __Result__, input`
    return __Result__

  trim: (input, omit = ' \t') ->
    return Trim input, omit

  trimEnd: (input, omit = ' \t') ->
    return RTrim input, omit

  trimStart: (input, omit = ' \t') ->
    return LTrim input, omit

$ = new Toolkit()