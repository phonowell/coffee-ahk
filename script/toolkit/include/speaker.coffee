# beep(): void
$.beep = -> SoundBeep

# i(message: string): string
$.i = (message) ->
  $.info "#{$.now()} #{$.toString message}"
  return message

# info(message: string, point?: Point): string
$.info = (message, point = '') ->
  unless message
    return message
  unless point
    point = $.getPosition()
  _msg = $.toString message
  `ToolTip, % _msg, % point[1], % point[2]`
  return message