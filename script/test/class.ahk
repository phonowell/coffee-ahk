global __rf_ahk__ := Func("ahk_6")
class A extends B {
  a := 0
  b := {}
  c := {a: 1}
  __New() {
    base.__New()
    __rf_ahk__.Call(base.a, "#rf/ahk/1").Call()
    (Func("ahk_5").Bind(this)).Call()
  }
  d := Func("ahk_4").Bind(this)
  e := Func("ahk_3").Bind(this)
  f := Func("ahk_2").Bind(this)
}
global b := new A()
ahk_1(this) {
  return this.a
}
ahk_2(this) {
  (Func("ahk_1").Bind(this)).Call()
}
ahk_3(this, n) {
  return this.a + n
}
ahk_4(this) {
  return 1
}
ahk_5(this) {
  return this.a
}
ahk_6(__fn__, __token__) {
  if (__fn__) {
    return __fn__
  }
  throw Exception("invalid function: " . (__token__) . "")
}