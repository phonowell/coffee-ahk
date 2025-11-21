global fn := Func("ahk_3")
global errorFn := Func("ahk_2")
global obj := new MyClass()
class Ｄog extends Animal {
  bark := Func("ahk_1").Bind(this)
}
ahk_1(this) {
  return "woof"
}
ahk_2() {
  throw Exception("oops")
}
ahk_3() {
  return 42
}