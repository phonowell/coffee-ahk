global __rf_ahk__ := Func("ahk_1")
__rf_ahk__.Call(a).Call(this)
this.a := 1
__rf_ahk__.Call(a).Call(a.prototype)
a.prototype.a := 1
ahk_1(__fn__) {
  if (IsFunc(__fn__)) {
    return __fn__
  }
  throw Exception("invalid function")
}