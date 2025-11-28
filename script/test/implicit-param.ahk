global fn1 := Func("ahk_3")
global fn2 := Func("ahk_2")
global fn3 := Func("ahk_1")
ahk_1(λ := "", a) {
  if (!λ) {
    λ := {}
  }
  λ.a := a
  return λ.a + λ.b
}
ahk_2(λ := "") {
  if (!λ) {
    λ := {}
  }
  return λ.a * λ.b + λ.c
}
ahk_3(λ := "") {
  if (!λ) {
    λ := {}
  }
  return λ.x + λ.y
}