global fn1 := Func("ahk_14").Bind({})
global fn2 := Func("ahk_13").Bind({})
global fn3 := Func("ahk_12").Bind({})
global outer1 := Func("ahk_11").Bind({})
global level0 := Func("ahk_9").Bind({})
global outer2 := Func("ahk_6").Bind({})
class Ｃalculator {
  base := 100
  add := Func("ahk_3").Bind({}, this)
  compute := Func("ahk_1").Bind({}, this)
}
ahk_1(λ, ℓthis, x, y) {
  this := ℓthis
  λ.x := x
  λ.y := y
  return this.base + λ.x + λ.y
}
ahk_2(λ, multiplier) {
  λ.multiplier := multiplier
  return this.base + λ.value * λ.multiplier
}
ahk_3(λ, ℓthis, value) {
  this := ℓthis
  λ.value := value
  λ.helper := Func("ahk_2").Bind(λ)
  λ.helper.Call(2)
}
ahk_4(λ) {
  return λ.sharedParam
}
ahk_5(λ) {
  return λ.sharedParam := λ.sharedParam * 2
}
ahk_6(λ, sharedParam) {
  λ.sharedParam := sharedParam
  λ.modify := Func("ahk_5").Bind(λ)
  λ.read := Func("ahk_4").Bind(λ)
  λ.modify.Call()
  λ.read.Call()
}
ahk_7(λ, c) {
  λ.c := c
  return λ.a + λ.b + λ.c
}
ahk_8(λ, b) {
  λ.b := b
  λ.level2 := Func("ahk_7").Bind(λ)
  λ.level2.Call(3)
}
ahk_9(λ, a) {
  λ.a := a
  λ.level1 := Func("ahk_8").Bind(λ)
  λ.level1.Call(2)
}
ahk_10(λ, innerParam) {
  λ.innerParam := innerParam
  return λ.outerParam + λ.innerParam
}
ahk_11(λ, outerParam) {
  λ.outerParam := outerParam
  λ.inner := Func("ahk_10").Bind(λ)
  λ.inner.Call(10)
}
ahk_12(λ, p, q, r) {
  λ.p := p
  λ.q := q
  λ.r := r
  return λ.p * λ.q + λ.r
}
ahk_13(λ, x, y) {
  λ.x := x
  λ.y := y
  return λ.x + λ.y
}
ahk_14(λ, a) {
  λ.a := a
  return λ.a
}