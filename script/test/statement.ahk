global fn := Func("ahk_3").Bind({})
global errorFn := Func("ahk_2").Bind({})
global obj := new MyClass()
class Ｄog extends Animal {
  bark := Func("ahk_1").Bind(this)
}
ahk_1(λ, ℓthis) {
  this := ℓthis
  return "woof"
}
ahk_2(λ) {
  throw Exception("oops")
}
ahk_3(λ) {
  return 42
}