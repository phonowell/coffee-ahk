dataPick = [1, 10]
pick = ->

  if dataPick[1] > dataPick[2]
    dataPick[1] = 1
    $.press 'f'
    $.click 'wheel-down:up'
    return

  dataPick[1]++
  $.press 'f'
  $.click 'wheel-down:down'

  setTimeout ->
    pick()
  , 100