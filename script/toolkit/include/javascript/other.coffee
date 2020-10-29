# alert(message: string): string
alert = (message = '') ->
  unless message
    return
  _msg = $.toString message
  `MsgBox, % _msg`
  return message