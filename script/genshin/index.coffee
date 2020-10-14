# include ../include/admin.ahk
# include ../include/head.ahk
# include ../toolkit/index.ahk

# variable

isPicking = false
stepPick = 0

# function

actionE = -> $.press 'e'

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

# binding

$.on 'alt + f4', ->
  $.beep()
  $.exit()

$.on 'f12', ->
  $.beep()
  $.pause()

$.on '1', ->
  $.clearTimeout actionE
  $.press '1'
  $.setTimeout actionE, 100

$.on '2', ->
  $.clearTimeout actionE
  $.press '2'
  $.setTimeout actionE, 100

$.on '3', ->
  $.clearTimeout actionE
  $.press '3'
  $.setTimeout actionE, 100

$.on '4', ->
  $.clearTimeout actionE
  $.press '4'
  $.setTimeout actionE, 100

$.on '5', ->
  $.clearTimeout actionE
  $.press '5'
  $.setTimeout actionE, 100

$.on 'space', ->
  $.clearTimeout jump
  jump()
  $.setTimeout jump, 200

$.on 'f', ->
  if isPicking then return
  isPicking = true
  fastPick()