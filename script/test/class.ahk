class A {
  a := 0
  b := {}
  c := {a: 1}
  d := Func("ahk_2").Bind(this)
  e := Func("ahk_1").Bind(this)
}
global a := new A()
ahk_1(this, n) {
  this.a + n
}
ahk_2(this) {
  return 1
}