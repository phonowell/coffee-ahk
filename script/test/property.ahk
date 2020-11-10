global __ctx_ahk__ := {}
a.Call(this)
this.a := 1
a.Call(a.prototype)
a.prototype.a := 1