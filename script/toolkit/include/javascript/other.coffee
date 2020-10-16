# alert(message: string): string
alert = (message = '') ->
  unless message
    return
  msg = $.toString message
  `MsgBox, % msg`
  return message