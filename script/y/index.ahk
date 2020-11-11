global __ctx_ahk__ := {}
global fn := Func("ahk_1")
ahk_1(callback) {
  callback.Call()
}
