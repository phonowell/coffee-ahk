$ = {}

$alert = (message = '') ->
  `MsgBox % message`
  return message

$bindToolkit = ->

  list = ['abs']
  $.alert = Func '$alert'
  $.alert.call list[1]

$bindToolkit()