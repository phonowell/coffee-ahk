class Ａnimal {
  __New(this.name) {
    
  }
  speak := Func("ahk_1").Bind(this)
}
ahk_1(λ, ℓthis) {
  if (!λ) λ := {}
  this := ℓthis
  return this.name
}