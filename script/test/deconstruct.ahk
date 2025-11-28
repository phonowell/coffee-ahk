global ℓarray := [1, 2]
global a := ℓarray[1]
global b := ℓarray[2]
ℓarray := arr
global x := ℓarray[1]
global y := ℓarray[2]
global z := ℓarray[3]
global ℓobject := person
global name := ℓobject["name"]
global age := ℓobject["age"]
ℓobject := obj
global foo := ℓobject["foo"]
global bar := ℓobject["bar"]
global fn1 := Func("ahk_11").Bind({})
global fn2 := Func("ahk_10").Bind({})
global fn3 := Func("ahk_8").Bind({})
global fn4 := Func("ahk_7").Bind({})
global fn5 := Func("ahk_5").Bind({})
global fn6 := Func("ahk_3").Bind({})
global fn7 := Func("ahk_1").Bind({})
ahk_1(λ) {
  λ.sum := 0
  λ.pairs := [[1, 2], [3, 4]]
  for ℓi, pair in λ.pairs {
    λ.pair := pair
    ℓi := ℓi - 1
    ℓarray := λ.pair
    λ.v1 := ℓarray[1]
    λ.v2 := ℓarray[2]
    λ.sum += λ.v1 + λ.v2
  }
  return λ.sum
}
ahk_2(λ) {
  return λ.p1 + λ.p2 + λ.q1 + λ.q2
}
ahk_3(λ) {
  ℓarray := [1, 2]
  λ.p1 := ℓarray[1]
  λ.p2 := ℓarray[2]
  ℓobject := {q1: 3, q2: 4}
  λ.q1 := ℓobject["q1"]
  λ.q2 := ℓobject["q2"]
  λ.calc := Func("ahk_2").Bind(λ)
  return λ.calc.Call()
}
ahk_4(λ) {
  return [10, 20]
}
ahk_5(λ) {
  λ.getData := Func("ahk_4").Bind(λ)
  ℓarray := λ.getData.Call()
  λ.first := ℓarray[1]
  λ.second := ℓarray[2]
  return λ.first + λ.second
}
ahk_6(λ) {
  λ.m := 10
  λ.n := 20
}
ahk_7(λ) {
  ℓobject := {m: 1, n: 2}
  λ.m := ℓobject["m"]
  λ.n := ℓobject["n"]
  λ.modifier := Func("ahk_6").Bind(λ)
  λ.modifier.Call()
  return λ.m + λ.n
}
ahk_8(λ) {
  ℓobject := {userName: "test", userAge: 25}
  λ.userName := ℓobject["userName"]
  λ.userAge := ℓobject["userAge"]
  return "" . (λ.userName) . ": " . (λ.userAge) . ""
}
ahk_9(λ) {
  λ.temp := λ.s
  λ.s := λ.t
  λ.t := λ.temp
}
ahk_10(λ) {
  ℓarray := [1, 2]
  λ.s := ℓarray[1]
  λ.t := ℓarray[2]
  λ.swap := Func("ahk_9").Bind(λ)
  λ.swap.Call()
  return [λ.s, λ.t]
}
ahk_11(λ) {
  ℓarray := [1, 2]
  λ.p := ℓarray[1]
  λ.q := ℓarray[2]
  return λ.p + λ.q
}