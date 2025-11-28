global fn1 := Func("ahk_12").Bind({})
global fn2 := Func("ahk_11").Bind({})
global fn3 := Func("ahk_9").Bind({})
global fn4 := Func("ahk_8").Bind({})
global fn5 := Func("ahk_6").Bind({})
global fn6 := Func("ahk_5").Bind({})
global fn7 := Func("ahk_3").Bind({})
global fn8 := Func("ahk_2").Bind({})
global fn9 := Func("ahk_1").Bind({})
ahk_1(λ, flag) {
  λ.flag := flag
  λ.result := 0
  if (λ.flag) {
    ℓarray := [1, 2]
    λ.x := ℓarray[1]
    λ.y := ℓarray[2]
    λ.result := λ.x + λ.y
  }
  return λ.result
}
ahk_2(λ) {
  λ.a := 1
  λ.b := 2
  ℓarray := [λ.b, λ.a]
  λ.a := ℓarray[1]
  λ.b := ℓarray[2]
  return [λ.a, λ.b]
}
ahk_3(λ) {
  ℓarray := [1, 2]
  λ.a := ℓarray[1]
  λ.b := ℓarray[2]
  ℓobject := {x: 3, y: 4}
  λ.x := ℓobject["x"]
  λ.y := ℓobject["y"]
  return λ.a + λ.b + λ.x + λ.y
}
ahk_4(λ) {
  return [1, 2, 3]
}
ahk_5(λ) {
  λ.getData := Func("ahk_4").Bind(λ)
  ℓarray := λ.getData.Call()
  λ.first := ℓarray[1]
  λ.second := ℓarray[2]
  return λ.first + λ.second
}
ahk_6(λ) {
  λ.sum := 0
  λ.data := [[1, 2], [3, 4], [5, 6]]
  for ℓi, item in λ.data {
    λ.item := item
    ℓi := ℓi - 1
    ℓarray := λ.item
    λ.a := ℓarray[1]
    λ.b := ℓarray[2]
    λ.sum += λ.a + λ.b
  }
  return λ.sum
}
ahk_7(λ) {
  λ.temp := λ.a
  λ.a := λ.b
  λ.b := λ.temp
}
ahk_8(λ) {
  ℓobject := {a: 1, b: 2}
  λ.a := ℓobject["a"]
  λ.b := ℓobject["b"]
  λ.swap := Func("ahk_7").Bind(λ)
  λ.swap.Call()
  return [λ.a, λ.b]
}
ahk_9(λ) {
  ℓobject := {name: "test", age: 25}
  λ.name := ℓobject["name"]
  λ.age := ℓobject["age"]
  return "" . (λ.name) . ": " . (λ.age) . ""
}
ahk_10(λ) {
  λ.x := 10
  λ.y := 20
}
ahk_11(λ) {
  ℓarray := [1, 2]
  λ.x := ℓarray[1]
  λ.y := ℓarray[2]
  λ.inner := Func("ahk_10").Bind(λ)
  λ.inner.Call()
  return λ.x + λ.y
}
ahk_12(λ) {
  ℓarray := [1, 2]
  λ.a := ℓarray[1]
  λ.b := ℓarray[2]
  return λ.a + λ.b
}