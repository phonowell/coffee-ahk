global fn := Func("ahk_2")
global nested := Func("ahk_1")
ahk_1(λ) {
  if (!λ) λ := {}
  if (true) {
    λ.x := 1
    λ.y := 2
  }
}
ahk_2(λ) {
  if (!λ) λ := {}
  λ.a := 1
  λ.b := 2
  λ.a + λ.b
}