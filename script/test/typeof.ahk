global ℓtype_ahk := Func("ahk_typeof").Bind({})
ahk_typeof(λ, ℓv) {
  if (ℓv == "") {
    return "undefined"
  }
  if ℓv is Number
  {
    return "number"
  }
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
global fn1 := Func("ahk_11").Bind({})
global fn2 := Func("ahk_10").Bind({})
global fn3 := Func("ahk_8").Bind({})
global fn4 := Func("ahk_6").Bind({})
global fn5 := Func("ahk_4").Bind({})
global fn6 := Func("ahk_2").Bind({})
ahk_1(λ) {
  return ℓtype_ahk.Call(λ.obj.val)
}
ahk_2(λ) {
  λ.obj := {val: 123}
  λ.checker := Func("ahk_1").Bind(λ)
  return λ.checker.Call()
}
ahk_3(λ) {
  return [ℓtype_ahk.Call(λ.num), ℓtype_ahk.Call(λ.str)]
}
ahk_4(λ) {
  λ.num := 1
  λ.str := "str"
  λ.builder := Func("ahk_3").Bind(λ)
  return λ.builder.Call()
}
ahk_5(λ) {
  return λ.val := "changed"
}
ahk_6(λ) {
  λ.val := 1
  λ.modifier := Func("ahk_5").Bind(λ)
  λ.modifier.Call()
  return ℓtype_ahk.Call(λ.val)
}
ahk_7(λ) {
  return ℓtype_ahk.Call(λ.value) == "number"
}
ahk_8(λ) {
  λ.value := 42
  λ.checkNumber := Func("ahk_7").Bind(λ)
  return λ.checkNumber.Call()
}
ahk_9(λ) {
  return ℓtype_ahk.Call(λ.data)
}
ahk_10(λ) {
  λ.data := "hello"
  λ.checker := Func("ahk_9").Bind(λ)
  return λ.checker.Call()
}
ahk_11(λ) {
  λ.num := 123
  return ℓtype_ahk.Call(λ.num)
}