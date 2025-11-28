setTimeout.Call(Func("ahk_4").Bind({}), 4000)
ahk_1(λ) {
  return 1
}
ahk_2(λ) {
  return λ.setTimeout.Call(Func("ahk_1").Bind(λ), 1000)
}
ahk_3(λ) {
  return λ.setTimeout.Call(Func("ahk_2").Bind(λ), 2000)
}
ahk_4(λ) {
  return λ.setTimeout.Call(Func("ahk_3").Bind(λ), 3000)
}