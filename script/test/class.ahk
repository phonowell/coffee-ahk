class Ａ extends B {
  a := 0
  b := {}
  c := {a: 1}
  __New() {
    base.__New()
    base.a.Call()
    (Func("ahk_5").Bind(λ)).Call(this)
  }
  d := Func("ahk_4").Bind({}, this)
  e := Func("ahk_3").Bind({}, this)
  f := Func("ahk_2").Bind({}, this)
}
global b := new Ａ()
ahk_1(λ, ℓthis) {
  this := ℓthis
  return this.a
}
ahk_2(λ, ℓthis) {
  this := ℓthis
  return (Func("ahk_1").Bind(λ)).Call(this)
}
ahk_3(λ, ℓthis, n) {
  this := ℓthis
  λ.n := n
  return this.a + λ.n
}
ahk_4(λ, ℓthis) {
  this := ℓthis
  return 1
}
ahk_5(λ, ℓthis) {
  this := ℓthis
  return this.a
}