global ℓci_ahk := Func("salt_1").Bind({})
salt_1(λ, ℓarr, ℓidx) {
  if ℓidx is Number
  {
    if (ℓidx < 0) {
      return ℓarr.Length() + ℓidx + 1
    }
    return ℓidx + 1
  }
  return ℓidx
}
global a := {a: 1}
a := {a: 1, b: 2}
a := {a: 1}
a := {a: 1, b: 2}
a := {a: 1, b: 2, c: {a: 1, b: 2, c: 3}}
global fn := Func("ahk_17").Bind({})
global ℓobject := {a: 1, b: 2, c: 3}
a := ℓobject["a"]
global b := ℓobject["b"]
global c := ℓobject["c"]
global fn1 := Func("ahk_16").Bind({})
global fn2 := Func("ahk_15").Bind({})
global fn3 := Func("ahk_13").Bind({})
global fn4 := Func("ahk_11").Bind({})
global fn5 := Func("ahk_9").Bind({})
global fn6 := Func("ahk_7").Bind({})
global fn7 := Func("ahk_4").Bind({})
global fn8 := Func("ahk_2").Bind({})
ahk_1(λ) {
  λ.obj := {}
  λ.obj[ℓci_ahk.Call(λ.obj, λ.key)] := λ.value
  return λ.obj
}
ahk_2(λ) {
  λ.key := "dynamic"
  λ.value := 123
  λ.builder := Func("ahk_1").Bind(λ)
  return λ.builder.Call()
}
ahk_3(λ) {
  return {first: λ.x, second: λ.y}
}
ahk_4(λ) {
  λ.x := "hello"
  λ.y := "world"
  λ.builder := Func("ahk_3").Bind(λ)
  return λ.builder.Call()
}
ahk_5(λ) {
  return λ.counter
}
ahk_6(λ) {
  return λ.counter += 1
}
ahk_7(λ) {
  λ.counter := 0
  λ.obj := {increment: Func("ahk_6").Bind(λ), get: Func("ahk_5").Bind(λ)}
  λ.obj.increment.Call()
  λ.obj.increment.Call()
  return λ.obj.get.Call()
}
ahk_8(λ) {
  λ.p := 10
  λ.q := 20
}
ahk_9(λ) {
  ℓobject := {p: 1, q: 2}
  λ.p := ℓobject["p"]
  λ.q := ℓobject["q"]
  λ.modifier := Func("ahk_8").Bind(λ)
  λ.modifier.Call()
  return λ.p + λ.q
}
ahk_10(λ) {
  return λ.config.inner.setting := "updated"
}
ahk_11(λ) {
  λ.config := {inner: {setting: "default"}}
  λ.updater := Func("ahk_10").Bind(λ)
  λ.updater.Call()
  return λ.config.inner.setting
}
ahk_12(λ) {
  return λ.data.value
}
ahk_13(λ) {
  λ.data := {value: 42}
  λ.getter := Func("ahk_12").Bind(λ)
  return λ.getter.Call()
}
ahk_14(λ) {
  λ.obj.x := 10
  λ.obj.y := 20
}
ahk_15(λ) {
  λ.obj := {x: 1, y: 2}
  λ.modifier := Func("ahk_14").Bind(λ)
  λ.modifier.Call()
  return λ.obj
}
ahk_16(λ) {
  λ.obj := {a: 1, b: 2}
  return λ.obj
}
ahk_17(λ) {
  a := {a: 1, b: {a: 1, b: 2}}
  λ.d := 1
}