global alert := Func("ahk_4").Bind({})
global alert2 := Func("ahk_3").Bind({})
global showInfo := Func("ahk_2").Bind({})
global getValue := Func("ahk_1").Bind({})
ahk_1(λ) {
  return %myVar%
}
ahk_2(λ) {
  
  gui, add, text,, Hello World
  gui, show
  
}
ahk_3(λ) {
  msgbox, % msg
}
ahk_4(λ) {
  msgbox, % msg
}