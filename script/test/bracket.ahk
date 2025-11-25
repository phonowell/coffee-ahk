global __ci_ahk__ := Func("salt_1")
salt_1(__arr__, __idx__) {
  if __idx__ is Number
    if (__idx__ < 0)
      return __arr__.Length() + __idx__ + 1
    return __idx__ + 1
  return __idx__
}

global a := (1 + 2) * 3
global b := (a + b) / (c + d)
global c := ((1 + 2) * 3) + 4
fn.Call((x + y))
fn.Call((a + b), (c + d))
global d := ((a))
global e := (((1 + 2)))
if ((a > b) && (c > d)) {
  x := 1
}
arr[__ci_ahk__.Call(arr, (i + 1))]