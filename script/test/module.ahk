(Func("ahk_7")).Call()
global __ahk_module_2__ := (Func("ahk_5")).Call()
global __ahk_module_3__ := (Func("ahk_3")).Call()
global plus := __ahk_module_2__.default
global m := __ahk_module_3__.default
global minus := __ahk_module_3__.minus
ahk_1(λ, a, b) {
  if (!λ) λ := {}
  λ.a := a
  λ.b := b
  return λ.a - λ.b
}
ahk_2(λ, a, b) {
  if (!λ) λ := {}
  λ.a := a
  λ.b := b
  return λ.a + λ.b
}
ahk_3(λ) {
  if (!λ) λ := {}
  plus := Func("ahk_2").Bind(λ)
  minus := Func("ahk_1").Bind(λ)
  return {default: {plus: plus, minus: minus}, plus: plus, minus: minus}
}
ahk_4(λ, a, b) {
  if (!λ) λ := {}
  λ.a := a
  λ.b := b
  return λ.a + λ.b
}
ahk_5(λ) {
  if (!λ) λ := {}
  return {default: Func("ahk_4").Bind(λ)}
}
ahk_6(λ, a, b) {
  if (!λ) λ := {}
  λ.a := a
  λ.b := b
  return λ.a + λ.b
}
ahk_7(λ) {
  if (!λ) λ := {}
  λ.add := Func("ahk_6").Bind(λ)
  λ.lodash := {add: λ.add}
}