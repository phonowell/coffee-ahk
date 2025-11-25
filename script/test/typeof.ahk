global __typeof_ahk__ := Func("ahk_typeof")
ahk_typeof(__v__) {
  if (__v__ == "") {
    return "undefined"
  }
  if __v__ is Number
    return "number"
  if (IsObject(__v__)) {
    if (IsFunc(__v__)) {
      return "function"
    }
    return "object"
  }
  return "string"
}
global __ci_ahk__ := Func("salt_1")
salt_1(__arr__, __idx__) {
  if __idx__ is Number
    if (__idx__ < 0)
      return __arr__.Length() + __idx__ + 1
    return __idx__ + 1
  return __idx__
}

global x := __typeof_ahk__.Call(y)
global z := __typeof_ahk__.Call(123)
global a := __typeof_ahk__.Call(obj.prop)
global b := __typeof_ahk__.Call(arr[__ci_ahk__.Call(arr), 0)]
global c := __typeof_ahk__.Call(fn.Call())
global d := __typeof_ahk__.Call(x) == "number"
global e := __typeof_ahk__.Call(x) == "string" || __typeof_ahk__.Call(x) == "number"
global f := __typeof_ahk__.Call(obj.a.b.c)
global g := __typeof_ahk__.Call(fn.Call().prop)
global h := __typeof_ahk__.Call("hello")
fn2.Call(__typeof_ahk__.Call(x))
global i := __typeof_ahk__.Call(~x)
global arr2 := [__typeof_ahk__.Call(x), __typeof_ahk__.Call(y)]
global obj2 := {t: __typeof_ahk__.Call(x)}
global j := __typeof_ahk__.Call(obj.method.Call().result)