global fn := Func("ahk_3")
global errorFn := Func("ahk_2")
global obj := new MyClass()
class Ｄog extends Animal {
  bark := Func("ahk_1").Bind(this)
}
ahk_1(λ := "", ℓthis) {
  if (!λ) {
    λ := {}
  }
  this := ℓthis
  return "woof"
}
ahk_2(λ := "") {
  if (!λ) {
    λ := {}
  }
  throw Exception("oops")
}
ahk_3(λ := "") {
  if (!λ) {
    λ := {}
  }
  return 42
}