global foo := 1
global bar := 2
global baz := foo + bar
global myFunc := Func("ahk_1")
global x := y := z := 0
ahk_1(λ := "", a, b) {
  if (!λ) λ := {}
  λ.a := a
  λ.b := b
  return λ.a + λ.b
}