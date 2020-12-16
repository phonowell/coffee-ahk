timer = ''

$.on 'ctrl + k', ->

  callback = ->
    $.off 'ctrl + o'
    alert 'xxx'

  $.on 'ctrl + o', callback

  clearTimeout timer
  timer = setTimeout (callback = callback) ->
    $.off 'ctrl + o', callback
  , 1e3