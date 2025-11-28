if (a > 1) {
  1
}
if (a > 1) {
  1
} else {
  2
}
if !(a > 1) {
  1
} else {
  2
}
if !(a > 1) {
  1
} else if (a > 2) {
  2
} else {
  3
}
if (a > 1) {
  if (b > 1) {
    1
  } else {
    2
  }
} else {
  3
}
global fn := Func("ahk_14").Bind({})
if !(fn.Call(1)) {
  1
} else {
  2
}
global fn1 := Func("ahk_13").Bind({})
global fn2 := Func("ahk_12").Bind({})
global fn3 := Func("ahk_10").Bind({})
global fn4 := Func("ahk_8").Bind({})
global fn5 := Func("ahk_6").Bind({})
global fn6 := Func("ahk_4").Bind({})
global fn7 := Func("ahk_2").Bind({})
ahk_1(λ) {
  return λ.value > λ.threshold
}
ahk_2(λ) {
  λ.threshold := 10
  λ.value := 15
  λ.result := "below"
  λ.checker := Func("ahk_1").Bind(λ)
  if (λ.checker.Call()) {
    λ.result := "above"
  }
  return λ.result
}
ahk_3(λ) {
  return λ.value := "changed"
}
ahk_4(λ) {
  λ.value := "unchanged"
  λ.flag := false
  if !(λ.flag) {
    λ.changer := Func("ahk_3").Bind(λ)
    λ.changer.Call()
  }
  return λ.value
}
ahk_5(λ) {
  return λ.result := 22
}
ahk_6(λ) {
  λ.result := 0
  λ.x := 2
  if (λ.x == 1) {
    λ.result := 1
  } else if (λ.x == 2) {
    λ.modifier := Func("ahk_5").Bind(λ)
    λ.modifier.Call()
  } else {
    λ.result := 99
  }
  return λ.result
}
ahk_7(λ) {
  return λ.level := 2
}
ahk_8(λ) {
  λ.level := 0
  λ.a := true
  λ.b := true
  if (λ.a) {
    if (λ.b) {
      λ.setter := Func("ahk_7").Bind(λ)
      λ.setter.Call()
    } else {
      λ.level := 1
    }
  }
  return λ.level
}
ahk_9(λ) {
  return λ.result := "else"
}
ahk_10(λ) {
  λ.result := "initial"
  λ.flag := false
  if (λ.flag) {
    λ.result := "if"
  } else {
    λ.modifier := Func("ahk_9").Bind(λ)
    λ.modifier.Call()
  }
  return λ.result
}
ahk_11(λ) {
  return λ.value := 42
}
ahk_12(λ) {
  λ.value := 0
  λ.condition := true
  if (λ.condition) {
    λ.setter := Func("ahk_11").Bind(λ)
    λ.setter.Call()
  }
  return λ.value
}
ahk_13(λ) {
  λ.result := "default"
  λ.flag := true
  if (λ.flag) {
    λ.result := "true branch"
  } else {
    λ.result := "false branch"
  }
  return λ.result
}
ahk_14(λ) {
  if !(1) {
    1
  } else {
    2
  }
}