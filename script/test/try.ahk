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
global fn := Func("anonymous_1")
anonymous_1() {
  try {
    alert.Call(1)
  } catch e {
    throw e
  }
}