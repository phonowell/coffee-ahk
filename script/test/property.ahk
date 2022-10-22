global __rf_ahk__ := Func("ahk_1")
__rf_ahk__.Call(a, "#rf/ahk/1").Call(this)
this.a := 1
__rf_ahk__.Call(a, "#rf/ahk/2").Call(a.prototype)
a.prototype.a := 1
ahk_1(__fn__, __token__) {
  if (__fn__) {
    return __fn__
  }
  throw Exception("invalid function: " . (__token__) . "")
}