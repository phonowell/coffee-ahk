# include ../include/head.ahk
# include ../toolkit/index

timer = ''

$.on '1', ->
  clearTimeout timer
  timer = setTimeout ->
    alert 1
  , 1e3

$.on '2', -> clearTimeout timer