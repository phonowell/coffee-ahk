(Func("ahk_7").Bind({})).Call()
global ℓm_ahk_2 := (Func("ahk_5").Bind({})).Call()
global ℓm_ahk_3 := (Func("ahk_3").Bind({})).Call()
global plus := ℓm_ahk_2.default
global m := ℓm_ahk_3.default
global minus := ℓm_ahk_3.minus
ahk_1(λ, a, b) {
  λ.a := a
  λ.b := b
  return λ.a - λ.b
}
ahk_2(λ, a, b) {
  λ.a := a
  λ.b := b
  return λ.a + λ.b
}
ahk_3(λ) {
  plus := Func("ahk_2").Bind(λ)
  minus := Func("ahk_1").Bind(λ)
  return {default: {plus: plus, minus: minus}, plus: plus, minus: minus}
}
ahk_4(λ, a, b) {
  λ.a := a
  λ.b := b
  return λ.a + λ.b
}
ahk_5(λ) {
  return {default: Func("ahk_4").Bind(λ)}
}
ahk_6(λ, a, b) {
  λ.a := a
  λ.b := b
  return λ.a + λ.b
}
ahk_7(λ) {
  λ.add := Func("ahk_6").Bind(λ)
  λ.lodash := {add: λ.add}
}