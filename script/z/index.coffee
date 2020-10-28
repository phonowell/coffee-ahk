# include ../include/head.ahk
# include ../toolkit/index.ahk

timer = ''

$.on 'win + n', ->
  clearTimeout timer
  timer = setTimeout ->
    $.open 'notepad.exe'
  , 1e3

$.on 'esc', -> clearTimeout timer

$.on 'alt + f4', -> $.exit()