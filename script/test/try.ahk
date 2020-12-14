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
fn := Func("ahk_1")
ahk_1() {
  try {
    alert.Call(1)
  } catch e {
    throw e
  }
}