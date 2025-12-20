try {
  a++
} catch {
  a--
}
try {
  a--
} catch e {
  a += 2
} finally {
  a += 3
}
global fn := Func("ahk_14").Bind({})
global fn1 := Func("ahk_13").Bind({})
global fn2 := Func("ahk_12").Bind({})
global fn3 := Func("ahk_10").Bind({})
global fn4 := Func("ahk_8").Bind({})
global fn5 := Func("ahk_6").Bind({})
global fn6 := Func("ahk_4").Bind({})
ahk_1(λ) {
  return λ.logArr.push.Call("finally")
}
ahk_2(λ) {
  return λ.logArr.push.Call("catch")
}
ahk_3(λ) {
  return λ.logArr.push.Call("try")
}
ahk_4(λ) {
  λ.logArr := []
  try {
    λ.adder := Func("ahk_3").Bind(λ)
    λ.adder.Call()
  } catch e {
    λ.adder := Func("ahk_2").Bind(λ)
    λ.adder.Call()
  } finally {
    λ.adder := Func("ahk_1").Bind(λ)
    λ.adder.Call()
  }
  return λ.logArr
}
ahk_5(λ) {
  return λ.level := 2
}
ahk_6(λ) {
  λ.level := 0
  try {
    λ.level := 1
    try {
      λ.setter := Func("ahk_5").Bind(λ)
      λ.setter.Call()
    } catch inner {
      λ.level := -2
    }
  } catch outer {
    λ.level := -1
  }
  return λ.level
}
ahk_7(λ) {
  return λ.cleanup := true
}
ahk_8(λ) {
  λ.cleanup := false
  try {
    λ.x := 1
  } finally {
    λ.finalizer := Func("ahk_7").Bind(λ)
    λ.finalizer.Call()
  }
  return λ.cleanup
}
ahk_9(λ) {
  return λ.status := "error caught"
}
ahk_10(λ) {
  λ.status := "ok"
  try {
    throw "error"
  } catch e {
    λ.handler := Func("ahk_9").Bind(λ)
    λ.handler.Call()
  }
  return λ.status
}
ahk_11(λ) {
  return λ.value := 42
}
ahk_12(λ) {
  λ.value := 0
  try {
    λ.setter := Func("ahk_11").Bind(λ)
    λ.setter.Call()
  } catch e {
    λ.value := -1
  }
  return λ.value
}
ahk_13(λ) {
  λ.result := "initial"
  try {
    λ.result := "try block"
  } catch e {
    λ.result := "catch block"
  }
  return λ.result
}
ahk_14(λ) {
  try {
    λ.alert.Call(1)
  } catch e {
    throw e
  }
}