class A extends B {
  a := 0
  b := {}
  c := {a: 1}
  __New() {
    base.__New()
    base.a.Call()
    Func("ahk_5").Bind(this).Call()
    return 1
  }
  d := Func("ahk_4").Bind(this)
  e := Func("ahk_3").Bind(this)
  f := Func("ahk_2").Bind(this)
}
global b := new A()
ahk_1(this) {
  this.a
}
ahk_2(this) {
  Func("ahk_1").Bind(this).Call()
}
ahk_3(this, n) {
  this.a + n
}
ahk_4(this) {
  return 1
}
ahk_5(this) {
  return this.a
}