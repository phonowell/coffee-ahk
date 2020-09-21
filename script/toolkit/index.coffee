class Toolkit

  alert: (message = '') ->
    `MsgBox % message`
    return message

$ = new Toolkit()