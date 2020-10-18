# include ../include/admin.ahk
# include ../include/head.ahk
# include ../toolkit/index

# variable

timer = ''

# function

dataAct = [1, 5]
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

jump = -> $.press 'space'

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

# binding

$.on 'alt + f4', ->
  $.beep()
  $.exit()

$.on 'f12', ->
  $.beep()
  $.pause()

$.on '1', ->
  $.press '1'
  act()

$.on '2', ->
  $.press '2'
  act()

$.on '3', ->
  $.press '3'
  act()

$.on '4', ->
  $.press '4'
  act()

$.on '5', ->
  $.press '5'
  act()

$.on 'f', -> pick()

$.on 'space', ->
  clearTimeout timer
  jump()
  timer = setTimeout jump, 200