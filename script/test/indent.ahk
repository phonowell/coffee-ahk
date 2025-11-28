global fn := Func("ahk_2").Bind({})
global nested := Func("ahk_1").Bind({})
ahk_1(λ) {
  if (true) {
    λ.x := 1
    λ.y := 2
  }
}
ahk_2(λ) {
  λ.a := 1
  λ.b := 2
  λ.a + λ.b
}