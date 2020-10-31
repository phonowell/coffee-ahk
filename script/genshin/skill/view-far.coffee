tsViewFar = 0

viewFar = ->

  unless $.now() - tsViewFar > 2e3
    return
  tsViewFar = $.now()

  $.click 'wheel-down:down'
  setTimeout ->
    $.click 'wheel-down:up'
  , 500