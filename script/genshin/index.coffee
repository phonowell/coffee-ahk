# include ../include/admin.ahk
# include ../include/head.ahk
# include ../toolkit/index.ahk

# variable

isPicking = false
stepPick = 0
timer = ''

# function

jump = -> $.press 'space'

useE = -> $.press 'e'

# binding

$.on 'alt + f4', ->
  $.beep()
  $.exit()

$.on 'f12', ->
  $.beep()
  $.pause()

$.on '1', ->
  clearTimeout timer
  $.press '1'
  timer = setTimeout useE, 100

$.on '2', ->
  clearTimeout timer
  $.press '2'
  timer = setTimeout useE, 100

$.on '3', ->
  clearTimeout timer
  $.press '3'
  timer = setTimeout useE, 100

$.on '4', ->
  clearTimeout timer
  $.press '4'
  timer = setTimeout useE, 100

$.on '5', ->
  clearTimeout timer
  $.press '5'
  timer = setTimeout useE, 100

$.on 'f', ->

  $.press 'f'
  $.click 'wheel-down:down'

  setTimeout ->
    $.press 'f'
    $.click 'wheel-down:down'
  , 100

  setTimeout ->
    $.press 'f'
    $.click 'wheel-down:down'
  , 200

  setTimeout ->
    $.press 'f'
    $.click 'wheel-down:down'
  , 300

  setTimeout ->
    $.press 'f'
    $.click 'wheel-down:down'
  , 400

  setTimeout ->
    $.press 'f'
    $.click 'wheel-down:down'
  , 500

  setTimeout ->
    $.press 'f'
    $.click 'wheel-down:down'
  , 600

  setTimeout ->
    $.press 'f'
    $.click 'wheel-down:down'
  , 700

  setTimeout ->
    $.press 'f'
    $.click 'wheel-down:down'
  , 800

  setTimeout ->
    $.press 'f'
    $.click 'wheel-down:down'
  , 900

  setTimeout ->
    $.press 'f'
    $.click 'wheel-down:up'
  , 1e3

$.on 'space', ->
  clearTimeout timer
  jump()
  timer = setTimeout jump, 200