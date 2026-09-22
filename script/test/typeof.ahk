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
global fn1 := Func("ahk_12").Bind({})
global fn2 := Func("ahk_11").Bind({})
global fn3 := Func("ahk_9").Bind({})
global fn4 := Func("ahk_7").Bind({})
global fn5 := Func("ahk_5").Bind({})
global fn6 := Func("ahk_3").Bind({})
global n1 := ℓtype_ahk.Call(ℓtype_ahk.Call(x))
global t1 := ℓtype_ahk.Call(f.Call(1, 2))
global t2 := ℓtype_ahk.Call([x, y])
global t3 := ℓtype_ahk.Call({k: 1})
global t4 := ℓtype_ahk.Call(Func("ahk_1").Bind({}))
ahk_1(λ) {
  return 1
}
ahk_2(λ) {
  return ℓtype_ahk.Call(λ.obj.val)
}
ahk_3(λ) {
  λ.obj := {val: 123}
  λ.checker := Func("ahk_2").Bind(λ)
  return λ.checker.Call()
}
ahk_4(λ) {
  return [ℓtype_ahk.Call(λ.num), ℓtype_ahk.Call(λ.str)]
}
ahk_5(λ) {
  λ.num := 1
  λ.str := "str"
  λ.builder := Func("ahk_4").Bind(λ)
  return λ.builder.Call()
}
ahk_6(λ) {
  return λ.val := "changed"
}
ahk_7(λ) {
  λ.val := 1
  λ.modifier := Func("ahk_6").Bind(λ)
  λ.modifier.Call()
  return ℓtype_ahk.Call(λ.val)
}
ahk_8(λ) {
  return ℓtype_ahk.Call(λ.value) == "number"
}
ahk_9(λ) {
  λ.value := 42
  λ.checkNumber := Func("ahk_8").Bind(λ)
  return λ.checkNumber.Call()
}
ahk_10(λ) {
  return ℓtype_ahk.Call(λ.data)
}
ahk_11(λ) {
  λ.data := "hello"
  λ.checker := Func("ahk_10").Bind(λ)
  return λ.checker.Call()
}
ahk_12(λ) {
  λ.num := 123
  return ℓtype_ahk.Call(λ.num)
}