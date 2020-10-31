bind = ->

  $.on '1', ->
    $.press '1'
    doAs ->
      $.press 'e'
    , 100, 2, 100

  $.on '2', ->
    $.press '2'
    doAs ->
      $.press 'e'
    , 100, 2, 100

  $.on '3', ->
    $.press '3'
    doAs ->
      $.press 'e'
    , 100, 2, 100

  $.on '4', ->
    $.press '4'
    doAs ->
      $.press 'e'
    , 100, 2, 100

  $.on '5', ->
    $.press '5'
    doAs ->
      $.press 'e'
    , 100, 2, 100

  $.on 'f', ->
    doAs (e) ->
      $.press 'f'
      unless e.count >= 10
        $.click 'wheel-down:down'
      else $.press 'wheel-down:up'
    , 100, 10

  $.on 's', ->
    $.press 's:down'
    startJumpBack()

  $.on 's:up', ->
    $.press 's:up'
    stopJumpBack()

  $.on 'space', -> jumpTwice()

  $.on 'w', ->
    $.press 'w:down'
    viewFar()

  $.on 'w:up', -> $.press 'w:up'