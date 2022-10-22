global __rf_ahk__ := Func("ahk_1")
global a := -1
global b := 2 - 1
global c := __rf_ahk__.Call(fn).Call(-1)
ahk_1(__fn__) {
  if (__fn__) {
    return __fn__
  }
  throw Exception("invalid function")
}