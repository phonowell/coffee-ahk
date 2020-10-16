$.on 'a', ->
  $.press 'b:down'
  setTimeout ->
    $.press 'b:up'
  , 3e3