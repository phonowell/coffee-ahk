class A extends B {
  a := 0
  b := {}
  c := {a: 1}
  __New() {
    base.__New()
    base.a.Call()
    return 1
  }
  d := Func("ahk_2").Bind(this)
  e := Func("ahk_1").Bind(this)
}
global b := new A()
ahk_1(this, n) {
  this.a + n
}
ahk_2(this) {
  return 1
}