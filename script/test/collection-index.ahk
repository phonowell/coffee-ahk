global __ci_ahk__ := Func("salt_1")
salt_1(__arr__, __idx__) {
  if __idx__ is Number
    if (__idx__ < 0)
      return __arr__.Length() + __idx__ + 1
    return __idx__ + 1
  return __idx__
}
a[1]
a["a"]
a[__ci_ahk__.Call(a, a)]
a[2.1]
a[3 + 2 + 1]
a[__ci_ahk__.Call(a, a - 1)]
a[__ci_ahk__.Call(a, 1 - a)]
a[__ci_ahk__.Call(a, this.b)]
a[__ci_ahk__.Call(a, this.b - 1)]
a[__ci_ahk__.Call(a, 1 - this.b)]
a["string" . (b) . ""]
a[__ci_ahk__.Call(a, fn.Call())]
a[__ci_ahk__.Call(a, this.fn.Call())]