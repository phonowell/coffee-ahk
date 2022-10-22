global __rf_ahk__ := Func("ahk_2")
global __ci_ahk__ := Func("ahk_1")
a[1]
a["a"]
a[__ci_ahk__.Call(a)]
a[2.1]
a[3 + 2 + 1]
a[__ci_ahk__.Call(a - 1)]
a[__ci_ahk__.Call(1 - a)]
a[__ci_ahk__.Call(this.b)]
a[__ci_ahk__.Call(this.b - 1)]
a[__ci_ahk__.Call(1 - this.b)]
a["string" . (b) . ""]
a[__ci_ahk__.Call(__rf_ahk__.Call(fn, "#rf/ahk/1").Call())]
a[__ci_ahk__.Call(__rf_ahk__.Call(this.fn, "#rf/ahk/2").Call())]
ahk_1(__ipt__) {
  if __ipt__ is Number
    return __ipt__ + 1
  return __ipt__
}
ahk_2(__fn__, __token__) {
  if (__fn__) {
    return __fn__
  }
  throw Exception("invalid function: " . (__token__) . "")
}