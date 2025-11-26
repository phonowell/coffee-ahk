global a := 1
while (a < 5) {
  a++
  1
}
global fn := Func("ahk_1")
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
ahk_1(__ctx__) {
  if (!__ctx__) __ctx__ := {}
  while (a < 5) {
    a++
  }
}