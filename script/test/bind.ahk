global topLevel := Func("ahk_15").Bind({})
global outer1 := Func("ahk_13").Bind({})
global outer2 := Func("ahk_11").Bind({})
global outer3 := Func("ahk_8").Bind({})
global outer4 := Func("ahk_5").Bind({})
class Ｃounter {
  count := 0
  increment := Func("ahk_3").Bind({}, this)
  getValue := Func("ahk_1").Bind({}, this)
}
ahk_1(λ, ℓthis) {
  this := ℓthis
  return this.count
}
ahk_2(λ, ℓthis) {
  this := ℓthis
  return this.count += 1
}
ahk_3(λ, ℓthis) {
  this := ℓthis
  λ.helper := Func("ahk_2").Bind(λ, this)
  λ.helper.Call()
}
ahk_4(λ) {
  return λ.i
}
ahk_5(λ) {
  for ℓi, i in [1, 2, 3] {
    λ.i := i
    ℓi := ℓi - 1
    λ.fn := Func("ahk_4").Bind(λ)
    λ.fn.Call()
  }
}
ahk_6(λ) {
  return λ.value * 2
}
ahk_7(λ) {
  return λ.value + 1
}
ahk_8(λ) {
  λ.value := 10
  λ.add := Func("ahk_7").Bind(λ)
  λ.mul := Func("ahk_6").Bind(λ)
  λ.add.Call() + λ.mul.Call()
}
ahk_9(λ) {
  return λ.a + λ.b
}
ahk_10(λ) {
  λ.b := 2
  λ.level2 := Func("ahk_9").Bind(λ)
  λ.level2.Call()
}
ahk_11(λ) {
  λ.a := 1
  λ.level1 := Func("ahk_10").Bind(λ)
  λ.level1.Call()
}
ahk_12(λ) {
  return λ.x + 1
}
ahk_13(λ) {
  λ.x := 1
  λ.inner := Func("ahk_12").Bind(λ)
  λ.inner.Call()
}
ahk_14(λ) {
  return 42
}
ahk_15(λ) {
  λ.inner := Func("ahk_14").Bind(λ)
  λ.inner.Call()
}