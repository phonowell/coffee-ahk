global a := 1
while (a < 5) {
  a++
  1
}
global fn := Func("ahk_12").Bind({})
global b := 0
while (b < 10) {
  b++
  if (b == 3) {
    continue
  }
  if (b == 7) {
    break
  }
}
global fn1 := Func("ahk_11").Bind({})
global fn2 := Func("ahk_10").Bind({})
global fn3 := Func("ahk_8").Bind({})
global fn4 := Func("ahk_6").Bind({})
global fn5 := Func("ahk_4").Bind({})
global fn6 := Func("ahk_2").Bind({})
ahk_1(λ) {
  return λ.i < λ.limit
}
ahk_2(λ) {
  λ.limit := 5
  λ.count := 0
  λ.i := 0
  λ.checker := Func("ahk_1").Bind(λ)
  while (λ.checker.Call()) {
    λ.count += 1
    λ.i++
  }
  return λ.count
}
ahk_3(λ) {
  return λ.result += 1
}
ahk_4(λ) {
  λ.result := 0
  λ.i := 0
  while (λ.i < 3) {
    λ.j := 0
    while (λ.j < 3) {
      λ.adder := Func("ahk_3").Bind(λ)
      λ.adder.Call()
      λ.j++
    }
    λ.i++
  }
  return λ.result
}
ahk_5(λ) {
  return λ.i == 5
}
ahk_6(λ) {
  λ.total := 0
  λ.i := 0
  while (λ.i < 10) {
    λ.i++
    λ.skipper := Func("ahk_5").Bind(λ)
    if (λ.skipper.Call()) {
      continue
    }
    λ.total += λ.i
  }
  return λ.total
}
ahk_7(λ) {
  return λ.i > 5
}
ahk_8(λ) {
  λ.result := 0
  λ.i := 0
  while (true) {
    λ.result := λ.i
    λ.i++
    λ.checker := Func("ahk_7").Bind(λ)
    if (λ.checker.Call()) {
      break
    }
  }
  return λ.result
}
ahk_9(λ) {
  return λ.sum += λ.i
}
ahk_10(λ) {
  λ.sum := 0
  λ.i := 1
  while (λ.i <= 3) {
    λ.adder := Func("ahk_9").Bind(λ)
    λ.adder.Call()
    λ.i++
  }
  return λ.sum
}
ahk_11(λ) {
  λ.count := 0
  λ.i := 0
  while (λ.i < 5) {
    λ.count += λ.i
    λ.i++
  }
  return λ.count
}
ahk_12(λ) {
  while (a < 5) {
    a++
  }
}