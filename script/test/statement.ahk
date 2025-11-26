global fn := Func("ahk_3")
global errorFn := Func("ahk_2")
global obj := new MyClass()
class Ｄog extends Animal {
  bark := Func("ahk_1").Bind(this)
}
ahk_1(__ctx__, __this__) {
  if (!__ctx__) __ctx__ := {}
  this := __this__
  return "woof"
}
ahk_2(__ctx__) {
  if (!__ctx__) __ctx__ := {}
  throw Exception("oops")
}
ahk_3(__ctx__) {
  if (!__ctx__) __ctx__ := {}
  return 42
}