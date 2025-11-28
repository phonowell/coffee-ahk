global fn1 := Func("ahk_4").Bind({})
global fn2 := Func("ahk_3").Bind({})
global fn3 := Func("ahk_2").Bind({})
global fn4 := Func("ahk_1").Bind({})
ahk_1(λ) {
  λ.x := 1
  λ.x + 1
}
ahk_2(λ) {
  return λ.a + λ.b
}
ahk_3(λ) {
  return "hello"
}
ahk_4(λ) {
  return 42
}