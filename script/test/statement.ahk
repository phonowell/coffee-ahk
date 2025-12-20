global fn := Func("ahk_4").Bind({})
global errorFn := Func("ahk_3").Bind({})
global obj := new MyClass()
class Ａnimal {
  speak := Func("ahk_2").Bind({}, this)
}
class Ｄog extends Ａnimal {
  bark := Func("ahk_1").Bind({}, this)
}
ahk_1(λ, ℓthis) {
  this := ℓthis
  return "woof"
}
ahk_2(λ, ℓthis) {
  this := ℓthis
  return "sound"
}
ahk_3(λ) {
  throw Exception("oops")
}
ahk_4(λ) {
  return 42
}