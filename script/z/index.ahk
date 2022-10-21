global __rf_ahk__ := Func("ahk_1")
__rf_ahk__.Call(this.a).Call()
ahk_1(__fn__) {
  if (IsFunc(__fn__)) {
    return __fn__
  }
  throw Exception("invalid function")
}
