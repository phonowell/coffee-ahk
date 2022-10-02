global alert := Func("ahk_2")
global alert2 := Func("ahk_1")
ahk_1() {
  msgbox, % msg
}
ahk_2() {
  msgbox, % msg
}