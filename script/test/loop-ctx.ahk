global fn1 := Func("ahk_20").Bind({})
global fn2 := Func("ahk_19").Bind({})
global fn3 := Func("ahk_18").Bind({})
global fn4 := Func("ahk_17").Bind({})
global fn5 := Func("ahk_15").Bind({})
global fn6 := Func("ahk_12").Bind({})
global fn7 := Func("ahk_11").Bind({})
global fn8 := Func("ahk_9").Bind({})
global fn9 := Func("ahk_8").Bind({})
global fn10 := Func("ahk_7").Bind({})
global fn11 := Func("ahk_5").Bind({})
global fn12 := Func("ahk_3").Bind({})
global fn13 := Func("ahk_2").Bind({})
global fn14 := Func("ahk_1").Bind({})
ahk_1(λ) {
  λ.arr := []
  for ℓi, i in [1, 2, 3] {
    λ.i := i
    ℓi := ℓi - 1
    λ.arr.push.Call(λ.i * 2)
  }
  return λ.arr
}
ahk_2(λ) {
  λ.obj := {sum: 0}
  for ℓi, x in [1, 2, 3] {
    λ.x := x
    ℓi := ℓi - 1
    λ.obj.sum += λ.x
  }
  return λ.obj.sum
}
ahk_3(λ) {
  λ.counter := 0
  for ℓi, x in [1, 2] {
    λ.x := x
    ℓi := ℓi - 1
    λ.counter += λ.x
  }
  for ℓi, y in [3, 4] {
    λ.y := y
    ℓi := ℓi - 1
    λ.counter += λ.y
  }
  return λ.counter
}
ahk_4(λ) {
  return "" . (λ.key) . ": " . (λ.value) . ""
}
ahk_5(λ, data) {
  λ.data := data
  λ.output := []
  for key, value in λ.data {
    λ.key := key
    λ.value := value
    λ.formatter := Func("ahk_4").Bind(λ)
    λ.output.push.Call(λ.formatter.Call())
  }
  return λ.output
}
ahk_6(λ) {
  return "processing " . (λ.item) . ""
}
ahk_7(λ) {
  λ.handlers := []
  for ℓi, item in ["a", "b", "c"] {
    λ.item := item
    ℓi := ℓi - 1
    λ.handler := Func("ahk_6").Bind(λ)
    λ.handlers.push.Call(λ.handler)
  }
  return λ.handlers
}
ahk_8(λ) {
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
ahk_9(λ) {
  λ.lastValue := 0
  for ℓi, x in [1, 2, 3, 4, 5] {
    λ.x := x
    ℓi := ℓi - 1
    λ.lastValue := λ.x
    if (λ.x == 3) {
      break
    }
  }
  return λ.lastValue
}
ahk_10(λ) {
  return λ.i
}
ahk_11(λ) {
  λ.result := []
  λ.i := 0
  while (λ.i < 3) {
    λ.fn := Func("ahk_10").Bind(λ)
    λ.result.push.Call(λ.fn)
    λ.i++
  }
  return λ.result
}
ahk_12(λ) {
  λ.count := 0
  λ.i := 0
  while (λ.i < 5) {
    λ.count += λ.i
    λ.i++
  }
  return λ.count
}
ahk_13(λ) {
  return λ.i
}
ahk_14(λ, i) {
  λ.i := i
  return λ.fns.push.Call(Func("ahk_13").Bind(λ))
}
ahk_15(λ) {
  λ.fns := []
  for ℓi, i in [1, 2, 3] {
    λ.i := i
    ℓi := ℓi - 1
    (Func("ahk_14").Bind(λ)).Call()
  }
  return λ.fns
}
ahk_16(λ) {
  return λ.i
}
ahk_17(λ) {
  λ.fns := []
  for ℓi, i in [1, 2, 3] {
    λ.i := i
    ℓi := ℓi - 1
    λ.fns.push.Call(Func("ahk_16").Bind(λ))
  }
  return λ.fns
}
ahk_18(λ) {
  λ.total := 0
  for ℓi, i in [1, 2] {
    λ.i := i
    ℓi := ℓi - 1
    for ℓi, j in [3, 4] {
      λ.j := j
      ℓi := ℓi - 1
      λ.total += λ.i * λ.j
    }
  }
  return λ.total
}
ahk_19(λ, obj) {
  λ.obj := obj
  λ.result := ""
  for k, v in λ.obj {
    λ.k := k
    λ.v := v
    λ.result := λ.result + λ.k + λ.v
  }
  return λ.result
}
ahk_20(λ) {
  λ.sum := 0
  for ℓi, x in [1, 2, 3] {
    λ.x := x
    ℓi := ℓi - 1
    λ.sum += λ.x
  }
  return λ.sum
}