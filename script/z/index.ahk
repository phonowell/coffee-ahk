class A {
  a := 0
  b := {}
  c := {a: 1}
  d := Func("z_2").Bind(this)
  e := Func("z_1").Bind(this)
}
global a := new A()
z_1(this, n) {
  this.a + n
}
z_2(this) {
  return 1
}
