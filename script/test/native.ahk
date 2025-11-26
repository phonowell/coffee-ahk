global alert := Func("ahk_4")
global alert2 := Func("ahk_3")
global showInfo := Func("ahk_2")
global getValue := Func("ahk_1")
ahk_1(__ctx__) {
  if (!__ctx__) __ctx__ := {}
  return %myVar%
}
ahk_2(__ctx__) {
  if (!__ctx__) __ctx__ := {}
  
  gui, add, text,, Hello World
  gui, show
  
}
ahk_3(__ctx__) {
  if (!__ctx__) __ctx__ := {}
  msgbox, % msg
}
ahk_4(__ctx__) {
  if (!__ctx__) __ctx__ := {}
  msgbox, % msg
}