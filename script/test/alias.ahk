class Ａnimal {
  __New(this.name) {
    
  }
  speak := Func("ahk_1").Bind(this)
}
ahk_1(__ctx__, __this__) {
  if (!__ctx__) __ctx__ := {}
  this := __this__
  return this.name
}