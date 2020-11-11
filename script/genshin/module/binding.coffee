bind = ->

  for key in ['1', '2', '3', '4', '5']
    $.on key, (
      (key) ->
        $.press key
        doAs ->
          $.press 'e'
        , 100, 2, 100
    ).Bind key

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