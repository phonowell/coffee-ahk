bind = ->
  $.off 'f12', init
  $.on '1', bind1
  $.on '2', bind2
  $.on '3', bind3
  $.on '4', bind4
  $.on '5', bind5
  $.on 'f', bindF
  $.on 'space', bindSpace

bind1 = ->
  $.press '1'
  act()

bind2 = ->
  $.press '2'
  act()

bind3 = ->
  $.press '3'
  act()

bind4 = ->
  $.press '4'
  act()

bind5 = ->
  $.press '5'
  act()

bindF = -> pick()

bindSpace = ->
  clearTimeout timer
  jump()
  timer = setTimeout jump, 200