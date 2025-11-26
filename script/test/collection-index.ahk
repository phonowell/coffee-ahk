global __ci_ahk__ := Func("salt_1")
salt_1(__arr__, __idx__) {
  if __idx__ is Number
    if (__idx__ < 0)
      return __arr__.Length() + __idx__ + 1
    return __idx__ + 1
  return __idx__
}

a[1]
a[2]
a[11]
a["a"]
a["key"]
a[__ci_ahk__.Call(a, a)]
a[__ci_ahk__.Call(a, idx)]
a[__ci_ahk__.Call(a, 1.1)]
a[__ci_ahk__.Call(a, 3 + 2)]
a[__ci_ahk__.Call(a, a - 1)]
a[__ci_ahk__.Call(a, 1 - a)]
a[__ci_ahk__.Call(a, this.b)]
a[__ci_ahk__.Call(a, this.b - 1)]
a[__ci_ahk__.Call(a, 1 - this.b)]
a["string" . (b) . ""]
a[__ci_ahk__.Call(a, fn.Call())]
a[__ci_ahk__.Call(a, this.fn.Call())]
a[__ci_ahk__.Call(a, b[__ci_ahk__.Call(b, c)])]
a[__ci_ahk__.Call(a, b[__ci_ahk__.Call(b, c[__ci_ahk__.Call(c, d)])])]
arr[1] := 1
arr[2] := 2
arr[__ci_ahk__.Call(arr, i)] := value
arr[__ci_ahk__.Call(arr, idx)] := 999
arr[__ci_ahk__.Call(arr, i + 1)] := x
arr[__ci_ahk__.Call(arr, len - 1)] := y
obj.items[1] := first
obj.items[__ci_ahk__.Call(obj.items, i)] := value