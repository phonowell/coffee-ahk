class Ａnimal {
  __New(this.name) {
    
  }
  speak := Func("ahk_1").Bind(this)
}
ahk_1(this) {
  return this.name
}