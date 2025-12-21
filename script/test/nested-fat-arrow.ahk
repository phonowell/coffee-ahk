class ＴestＣlass {
  method := Func("ahk_2").Bind({}, this)
}
ahk_1(λ, ℓthis) {
  this := ℓthis
  return this
}
ahk_2(λ, ℓthis, x) {
  this := ℓthis
  λ.x := x
  λ.inner := Func("ahk_1").Bind(λ, this)
  λ.inner.Call()
}