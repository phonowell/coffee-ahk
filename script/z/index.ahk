﻿; Generated by Coffee-AHK/0.0.39
global alert := Func("ahk_1")
global a := 1
++a
alert.Call(a)
ahk_1(msg) {
  msgbox, % msg
}
