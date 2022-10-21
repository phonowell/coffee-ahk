global __rf_ahk__ := Func("ahk_2")
try {
  1
} catch {
  2
}
try {
  1
} catch e {
  2
} finally {
  3
}
global fn := Func("ahk_1").Bind(alert, e)
ahk_1(alert, e) {
  try {
    __rf_ahk__.Call(alert).Call(1)
  } catch e {
    throw e
  }
}
ahk_2(__fn__) {
  if (IsFunc(__fn__)) {
    return __fn__
  }
  throw Exception("invalid function")
}