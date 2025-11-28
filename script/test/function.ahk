global fn := Func("ahk_13").Bind({})
fn := Func("ahk_12").Bind({})
fn := Func("ahk_11").Bind({})
fn := Func("ahk_10").Bind({})
fn.Call(1, 2)
fn.Call(fn.Call(fn))
fn := Func("ahk_9").Bind({})
fn := Func("ahk_8").Bind({})
(Func("ahk_4").Bind({})).Call()
ahk_1(λ, a, b) {
  λ.a := a
  λ.b := b
  return λ.a + λ.b
}
ahk_2(λ, a) {
  λ.a := a
  return λ.a + λ.b
}
ahk_3(λ) {
  return λ.a + λ.b
}
ahk_4(λ) {
  λ.fn1 := Func("ahk_3").Bind(λ)
  λ.fn2 := Func("ahk_2").Bind(λ)
  λ.fn3 := Func("ahk_1").Bind(λ)
}
ahk_5(λ) {
  return λ.a + λ.b + λ.c
}
ahk_6(λ) {
  λ.c := 3
  return (Func("ahk_5").Bind(λ)).Call()
}
ahk_7(λ, b := 2) {
  λ.b := b
  return (Func("ahk_6").Bind(λ)).Call()
}
ahk_8(λ) {
  λ.a := 1
  return (Func("ahk_7").Bind(λ)).Call()
}
ahk_9(λ, a, b, c) {
  λ.a := a
  λ.b := b
  λ.c := c
  λ.a
  λ.b.Call()
  λ.c.Call(λ.a)
}
ahk_10(λ, a := 1, b := 2) {
  λ.a := a
  λ.b := b
  return λ.a + λ.b
}
ahk_11(λ, a, b*) {
  λ.a := a
  λ.b := b
  return λ.b[2]
}
ahk_12(λ, a := 1) {
  λ.a := a
  return λ.a
}
ahk_13(λ) {
  return 1
}