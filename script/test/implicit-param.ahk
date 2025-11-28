global fn1 := Func("ahk_3").Bind({})
global fn2 := Func("ahk_2").Bind({})
global fn3 := Func("ahk_1").Bind({})
ahk_1(λ, a) {
  λ.a := a
  return λ.a + λ.b
}
ahk_2(λ) {
  return λ.a * λ.b + λ.c
}
ahk_3(λ) {
  return λ.x + λ.y
}