switch a {
  case 1: {
    1
  }
  case 2, 3: {
    2
  }
  default: {
    3
  }
}
global fn1 := Func("ahk_11").Bind({})
global fn2 := Func("ahk_10").Bind({})
global fn3 := Func("ahk_8").Bind({})
global fn4 := Func("ahk_6").Bind({})
global fn5 := Func("ahk_4").Bind({})
global fn6 := Func("ahk_2").Bind({})
ahk_1(λ) {
  return λ.x + λ.y
}
ahk_2(λ) {
  λ.x := 5
  λ.y := 3
  λ.result := 0
  λ.calculator := Func("ahk_1").Bind(λ)
  switch λ.calculator.Call() {
    case 8: {
      λ.result := "eight"
    }
    default: {
      λ.result := "other"
    }
  }
  return λ.result
}
ahk_3(λ) {
  return λ.result := 12
}
ahk_4(λ) {
  λ.result := 0
  λ.a := 1
  λ.b := 2
  switch λ.a {
    case 1: {
      switch λ.b {
        case 2: {
          λ.setter := Func("ahk_3").Bind(λ)
          λ.setter.Call()
        }
        default: {
          λ.result := 10
        }
      }
    }
    default: {
      λ.result := 0
    }
  }
  return λ.result
}
ahk_5(λ) {
  return λ.status := "unhandled"
}
ahk_6(λ) {
  λ.status := "unknown"
  λ.code := 99
  switch λ.code {
    case 0: {
      λ.status := "ok"
    }
    case 1: {
      λ.status := "error"
    }
    default: {
      λ.handler := Func("ahk_5").Bind(λ)
      λ.handler.Call()
    }
  }
  return λ.status
}
ahk_7(λ) {
  return λ.result := "mid"
}
ahk_8(λ) {
  λ.result := ""
  λ.x := 3
  switch λ.x {
    case 1, 2: {
      λ.result := "low"
    }
    case 3, 4: {
      λ.modifier := Func("ahk_7").Bind(λ)
      λ.modifier.Call()
    }
    default: {
      λ.result := "high"
    }
  }
  return λ.result
}
ahk_9(λ) {
  return λ.value := 100
}
ahk_10(λ) {
  λ.value := 0
  λ.x := 1
  switch λ.x {
    case 1: {
      λ.setter := Func("ahk_9").Bind(λ)
      λ.setter.Call()
    }
    case 2: {
      λ.value := 200
    }
  }
  return λ.value
}
ahk_11(λ) {
  λ.result := "none"
  λ.x := 2
  switch λ.x {
    case 1: {
      λ.result := "one"
    }
    case 2: {
      λ.result := "two"
    }
    default: {
      λ.result := "other"
    }
  }
  return λ.result
}