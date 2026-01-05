global fn1 := Func("ahk_10").Bind({})
global fn2 := Func("ahk_9").Bind({})
global fn3 := Func("ahk_8").Bind({})
global result1 := fn1.Call()
global result2 := fn2.Call(10)
global result3 := fn3.Call(2, 3)
global outer := Func("ahk_7").Bind({})
global apply := Func("ahk_5").Bind({})
apply.Call(Func("ahk_4").Bind({}))
global add := Func("ahk_3").Bind({})
global sub := Func("ahk_2").Bind({})
global mul := Func("ahk_1").Bind({})
ahk_1(λ, a, b) {
  λ.a := a
  λ.b := b
  return λ.a * λ.b
}
ahk_2(λ, a, b) {
  λ.a := a
  λ.b := b
  return λ.a - λ.b
}
ahk_3(λ, a, b) {
  λ.a := a
  λ.b := b
  return λ.a + λ.b
}
ahk_4(λ, x) {
  λ.x := x
  return λ.x * 2
}
ahk_5(λ, fn) {
  λ.fn := fn
  return λ.fn.Call(1)
}
ahk_6(λ) {
  return 42
}
ahk_7(λ) {
  λ.inner := Func("ahk_6").Bind(λ)
  λ.inner.Call()
}
ahk_8(λ, a, b) {
  λ.a := a
  λ.b := b
  return λ.a * λ.b
}
ahk_9(λ, a) {
  λ.a := a
  return λ.a + 1
}
ahk_10(λ) {
  return 1
}