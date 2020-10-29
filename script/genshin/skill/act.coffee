dataAct = [1, 2]
act = ->

  if dataAct[1] > dataAct[2]
    dataAct[1] = 1
    $.press 'e'
    return

  dataAct[1]++
  $.press 'e'

  setTimeout ->
    act()
  , 100