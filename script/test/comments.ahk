global a := 1
global b := 2
global c := 3
global fn := Func("ahk_2")
class Ａ {
  m := Func("ahk_1").Bind(this)
}
ahk_1(λ, ℓthis) {
  if (!λ) {
    λ := {}
  }
  this := ℓthis
  return 1
}
ahk_2(λ := "") {
  if (!λ) {
    λ := {}
  }
  return 1
}