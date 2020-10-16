# include ../include/head.ahk
# include ../toolkit/index.ahk

for i in [1, 2, 3, 4, 5]
  setTimeout ->
    $.info $.now()
  , i * 1e3