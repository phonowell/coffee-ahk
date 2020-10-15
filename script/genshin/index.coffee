# include ../include/admin.ahk
# include ../include/head.ahk
# include ../toolkit/index.ahk

# variable

isPicking = false
stepPick = 0
timer = ''

# function

fastPick = ->

  switch stepPick
    when 0, 1, 2, 3, 4, 5, 6, 7
      $.press 'f'
      $.click 'wheel-down:down'
    else
      $.click 'wheel-down:up'
      isPicking = false
      stepPick = 0
      return
  
  stepPick++
  $.setTimeout fastPick, 100

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
  if isPicking then return
  isPicking = true
  fastPick()

$.on 'space', ->
  clearTimeout timer
  jump()
  timer = setTimeout jump, 200