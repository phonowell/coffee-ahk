$ = {}

$.alert = (message = '') ->
  `MsgBox % message`
  return message

$.beep = -> SoundBeep

$.exit = -> ExitApp

$.click = (input) ->
  
  if !input
    Click
    return

  `Click % StrReplace input, ':', ' '`

# math
$.abs = (n) -> return Abs n
$.ceil = (n) -> return Ceil n
$.floor = (n) -> return Floor n
$.round = (n) -> return Round n

$.move = (x = 0, y = 0, speed = 0) ->
  `MouseMove x, y, speed`
  return [x, y, speed]

$.now = -> return A_TickCount

$.reload = -> Reload

$.sleep = (time = 0) -> `Sleep % time`

# trim
$.trim = (input) -> return `Trim input`
$.trimStart = (input) -> return `LTrim input`
$.trimEnd = (input) -> return `RTrim input`