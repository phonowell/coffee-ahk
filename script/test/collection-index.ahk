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
a[__ci_ahk__.Call(fn.Call())]
a[__ci_ahk__.Call(this.fn.Call())]
ahk_1(__ipt__) {
  if __ipt__ is Number
    return __ipt__ + 1
  return __ipt__
}