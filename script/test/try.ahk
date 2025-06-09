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
global fn := Func("ahk_1").Bind(alert, e)
ahk_1(alert, e) {
  try {
    alert.Call(1)
  } catch e {
    throw e
  }
}