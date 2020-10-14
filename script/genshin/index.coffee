# include ../include/admin.ahk
# include ../include/head.ahk
# include ../toolkit/index.ahk

# function

actionE = -> $.press 'e'

autoFly = ->
  $.clearTimeout jump
  jump()
  $.setTimeout jump, 200

changeCharacter1 = ->
  $.clearTimeout actionE
  $.press '1'
  $.setTimeout actionE, 100

changeCharacter2 = ->
  $.clearTimeout actionE
  $.press '2'
  $.setTimeout actionE, 100

changeCharacter3 = ->
  $.clearTimeout actionE
  $.press '3'
  $.setTimeout actionE, 100

changeCharacter4 = ->
  $.clearTimeout actionE
  $.press '4'
  $.setTimeout actionE, 100

changeCharacter5 = ->
  $.clearTimeout actionE
  $.press '5'
  $.setTimeout actionE, 100

exit = ->
  $.beep()
  $.exit()

stepPick = 0
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

pause = ->
  $.beep()
  $.pause()

isPicking = false
pick = ->
  
  if isPicking then return
  isPicking = true
  
  fastPick()

jump = -> $.press 'space'

# binding

$.on 'alt + f4', exit
$.on 'f12', pause

$.on '1', changeCharacter1
$.on '2', changeCharacter2
$.on '3', changeCharacter3
$.on '4', changeCharacter4
$.on '5', changeCharacter5

$.on 'space', autoFly

$.on 'wheel-down', pick