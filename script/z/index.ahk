class A {
  fn := Func("z_2").Bind(this)
}
z_1(this, a) {
  this.value
}
z_2(this) {
  Func("z_1").Bind(this, a).Call()
}
