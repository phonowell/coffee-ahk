global a := 1
global b := 2
global c := 3
global fn := Func("ahk_2").Bind({})
class Ａ {
  m := Func("ahk_1").Bind(this)
}
ahk_1(λ, ℓthis) {
  this := ℓthis
  return 1
}
ahk_2(λ) {
  return 1
}