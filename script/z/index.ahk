class A {
  display := Func("z_2").Bind(this)
  add := Func("z_1").Bind(this)
  value := 0
}
z_1(this, n) {
  this.value += n
}
z_2(this) {
  alert.Call(this.value)
}
