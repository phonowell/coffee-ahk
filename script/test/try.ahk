try {
  1
} catch {
  2
}
try {
  1
} catch e {
  2
} finally {
  3
}
global fn := Func("ahk_1")
ahk_1(__ctx__) {
  if (!__ctx__) __ctx__ := {}
  try {
    __ctx__.alert.Call(1)
  } catch e {
    throw e
  }
}