global alert := Func("ahk_4")
global alert2 := Func("ahk_3")
global showInfo := Func("ahk_2")
global getValue := Func("ahk_1")
ahk_1() {
  return %myVar%
}
ahk_2() {
  
  gui, add, text,, Hello World
  gui, show
  
}
ahk_3() {
  msgbox, % msg
}
ahk_4() {
  msgbox, % msg
}