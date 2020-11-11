# include ../include/head.ahk
# include ../toolkit/index.ahk

$.on 'f1', ->
  for i in [1, 2, 3, 4, 5]
    setTimeout (
      ((n) -> $.info n).Bind i
    ), i * 1e3