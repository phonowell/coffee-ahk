global myVar := 1
global _private := 2
global $dollar := 3
global someFunction := Func("ahk_3").Bind({})
global fn1 := Func("ahk_2").Bind({})
global fn2 := Func("ahk_1").Bind({})
global ℓarray := [1, 2]
global validA := ℓarray[1]
global validB := ℓarray[2]
try {
  x := 1
} catch err {
  console.log.Call(err)
}
for ℓi, item in [1, 2, 3] {
  ℓi := ℓi - 1
  console.log.Call(item)
}
for value, key in obj {
  value := value - 1
  console.log.Call(key, value)
}
global config := {name: "test", value: 123, Index: "allowed"}
ahk_1(λ, a, b, c) {
  λ.a := a
  λ.b := b
  λ.c := c
  return λ.a + λ.b + λ.c
}
ahk_2(λ, normalParam) {
  λ.normalParam := normalParam
  return λ.normalParam + 1
}
ahk_3(λ) {
  return 42
}