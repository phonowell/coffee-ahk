return myFunc := Func("ahk_1")
return myVar := "hello"
ahk_1(__ctx__) {
  if (!__ctx__) __ctx__ := {}
  return 42
}