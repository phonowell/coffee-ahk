global fn1 := Func("ahk_4")
global fn2 := Func("ahk_3")
global fn3 := Func("ahk_2")
global fn4 := Func("ahk_1")
ahk_1(λ := "") {
  if (!λ) {
    λ := {}
  }
  λ.x := 1
  λ.x + 1
}
ahk_2(λ := "") {
  if (!λ) {
    λ := {}
  }
  return λ.a + λ.b
}
ahk_3(λ := "") {
  if (!λ) {
    λ := {}
  }
  return "hello"
}
ahk_4(λ := "") {
  if (!λ) {
    λ := {}
  }
  return 42
}