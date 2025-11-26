global ℓtype_ahk := Func("ahk_typeof")
ahk_typeof(ℓv) {
  if (ℓv == "") {
    return "undefined"
  }
  if ℓv is Number
    return "number"
  if (IsObject(ℓv)) {
    if (IsFunc(ℓv)) {
      return "function"
    }
    return "object"
  }
  return "string"
}

global x := ℓtype_ahk.Call(y)
global z := ℓtype_ahk.Call(123)
global a := ℓtype_ahk.Call(obj.prop)
global b := ℓtype_ahk.Call(arr[1])
global c := ℓtype_ahk.Call(fn.Call())
global d := ℓtype_ahk.Call(x) == "number"
global e := ℓtype_ahk.Call(x) == "string" || ℓtype_ahk.Call(x) == "number"
global f := ℓtype_ahk.Call(obj.a.b.c)
global g := ℓtype_ahk.Call(fn.Call().prop)
global h := ℓtype_ahk.Call("hello")
fn2.Call(ℓtype_ahk.Call(x))
global i := ℓtype_ahk.Call(~x)
global arr2 := [ℓtype_ahk.Call(x), ℓtype_ahk.Call(y)]
global obj2 := {t: ℓtype_ahk.Call(x)}
global j := ℓtype_ahk.Call(obj.method.Call().result)