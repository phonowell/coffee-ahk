global __ahk_module_1__ := (Func("ahk_2")).Call()
global $abs := __ahk_module_1__
ahk_1(n) {
  return Abs(n)
}
ahk_2() {
  return Func("ahk_1")
}
