global __rf_ahk__ := Func("ahk_2")
if (a > 1) {
  1
}
if (a > 1) {
  1
} else {
  2
}
if !(a > 1) {
  1
} else {
  2
}
if !(a > 1) {
  1
} else if (a > 2) {
  2
} else {
  3
}
if (a > 1) {
  if (b > 1) {
    1
  } else {
    2
  }
} else {
  3
}
global fn := Func("ahk_1")
if !(__rf_ahk__.Call(fn).Call(1)) {
  1
} else {
  2
}
ahk_1() {
  if !(1) {
    1
  } else {
    2
  }
}
ahk_2(__fn__) {
  if (IsFunc(__fn__)) {
    return __fn__
  }
  throw Exception("invalid function")
}