class Ａnimal {
  __New(name) {
    this.name := name
  }
  speak := Func("ahk_1").Bind({}, this)
}
ahk_1(λ, ℓthis) {
  this := ℓthis
  return this.name
}