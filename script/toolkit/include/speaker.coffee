# include setter

class SpeakerToolkit extends SetterToolkit

  # alert(message: string): string
  alert: (message = '') ->
    unless message
      return
    msg = $.toString message
    `MsgBox, % msg`
    return message

  # beep(): void
  beep: -> SoundBeep

  # info(message: string, point?: Point): string
  info: (message = '', point = '') ->
    unless message
      return
    unless point
      point = $.getPosition()
    msg = $.toString message
    `ToolTip, % msg, % point[1], % point[2]`
    return message