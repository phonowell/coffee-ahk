import 'include/a.ahk'

alert = (msg) -> `msgbox, % msg`

a = 1
a += 1
alert a