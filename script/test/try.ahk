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
ahk_1(λ) {
  if (!λ) λ := {}
  try {
    λ.alert.Call(1)
  } catch e {
    throw e
  }
}