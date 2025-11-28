for ℓi, value in list {
  ℓi := ℓi - 1
  value
}
for index, value in list {
  index := index - 1
  value
}
for ℓk, value in map {
  value
}
for key, value in map {
  value
}
for i, a in [1, 2, 3] {
  i := i - 1
  for j, b in [3, 2, 1] {
    j := j - 1
    alert.Call(i + j)
  }
}
for ℓi, a in [1, 2, 3] {
  ℓi := ℓi - 1
  for ℓi, b in [3, 2, 1] {
    ℓi := ℓi - 1
    alert.Call(a + b)
  }
}
global fn1 := Func("ahk_13").Bind({})
global fn2 := Func("ahk_12").Bind({})
global fn3 := Func("ahk_11").Bind({})
global fn4 := Func("ahk_9").Bind({})
global fn5 := Func("ahk_6").Bind({})
global fn6 := Func("ahk_4").Bind({})
global fn7 := Func("ahk_2").Bind({})
global fn8 := Func("ahk_1").Bind({})
ahk_1(λ) {
  λ.sum := 0
  for ℓi, x in [1, 2, 3, 4, 5] {
    λ.x := x
    ℓi := ℓi - 1
    if (λ.x == 3) {
      continue
    }
    λ.sum += λ.x
  }
  return λ.sum
}
ahk_2(λ) {
  λ.last := 0
  for ℓi, x in [1, 2, 3, 4, 5] {
    λ.x := x
    ℓi := ℓi - 1
    λ.last := λ.x
    if (λ.x == 3) {
      break
    }
  }
  return λ.last
}
ahk_3(λ) {
  return "" . (λ.key) . "=" . (λ.value) . ""
}
ahk_4(λ, data) {
  λ.data := data
  λ.output := []
  for key, value in λ.data {
    λ.key := key
    λ.value := value
    λ.formatter := Func("ahk_3").Bind(λ)
    λ.output.push.Call(λ.formatter.Call())
  }
  return λ.output
}
ahk_5(λ) {
  return λ.result += λ.i * λ.j
}
ahk_6(λ) {
  λ.result := 0
  for ℓi, i in [1, 2] {
    λ.i := i
    ℓi := ℓi - 1
    for ℓi, j in [3, 4] {
      λ.j := j
      ℓi := ℓi - 1
      λ.adder := Func("ahk_5").Bind(λ)
      λ.adder.Call()
    }
  }
  return λ.result
}
ahk_7(λ) {
  return λ.i
}
ahk_8(λ, i) {
  λ.i := i
  return λ.fns.push.Call(Func("ahk_7").Bind(λ))
}
ahk_9(λ) {
  λ.fns := []
  for ℓi, i in [1, 2, 3] {
    λ.i := i
    ℓi := ℓi - 1
    (Func("ahk_8").Bind(λ)).Call()
  }
  return λ.fns
}
ahk_10(λ) {
  return λ.i
}
ahk_11(λ) {
  λ.fns := []
  for ℓi, i in [1, 2, 3] {
    λ.i := i
    ℓi := ℓi - 1
    λ.fns.push.Call(Func("ahk_10").Bind(λ))
  }
  return λ.fns
}
ahk_12(λ) {
  λ.sum := 0
  for ℓi, x in [1, 2, 3] {
    λ.x := x
    ℓi := ℓi - 1
    λ.sum += λ.x
  }
  return λ.sum
}
ahk_13(λ, obj) {
  λ.obj := obj
  λ.$result := ""
  for $key, $value in λ.obj {
    λ.$key := $key
    λ.$value := $value
    λ.$result := "" . (λ.$result) . ", " . (λ.$key) . ""
  }
  return λ.$result
}