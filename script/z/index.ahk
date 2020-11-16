global __ctx_02lrqv5ij9m__ := {}
#KeyHistory, 0
#MaxHotkeysPerInterval, 200
#MaxThreads, 20
#NoEnv
#Persistent
#SingleInstance, Force
#UseHook, On

CoordMode, Mouse, Client
CoordMode, Pixel, Client
CoordMode, ToolTip, Client
SendMode, Event
SetBatchLines, 100ms
SetKeyDelay, 0, 50
SetMouseDelay, 0, 50
StringCaseSense, On
global __ctx_toolkit__ := {}
global $ := {}
$.reverse := Func("toolkit_44") ; reverse(input: unknown[]): unknown[]
$.includes := Func("toolkit_43")
$.length := Func("toolkit_42") ; length(input: string | array | object): number
$.type := Func("toolkit_41") ; type(input: unknown): 'array' | 'number' | 'object' | 'string'
$.findColor := Func("toolkit_40") ; findColor( color: number, start: Point = [0, 0], end: Point = [A_ScreenWidth, A_ScreenHeight], variation = 0 ): Point
$.findImage := Func("toolkit_39") ; findImage( source: string, start: Point = [0, 0], end: Point = [A_ScreenWidth, A_ScreenHeight], ): Point
$.getColor := Func("toolkit_38") ; getColor(point?: Point): number
$.getPosition := Func("toolkit_37") ; getPosition(): Point
$.getState := Func("toolkit_36") ; getState(key: string): string
$.formatHotkey := Func("toolkit_35") ; formatHotkey(key: string): string
$.now := Func("toolkit_34") ; now(): number
$.random := Func("toolkit_33") ; random(min: number = 0, max: number = 1): number
$.click := Func("toolkit_32") ; click(key?: string): void
$.move := Func("toolkit_31") ; move(point: Point, speed: number = 0): void
$.press := Func("toolkit_30") ; press(key...: string): void
$.setFixed := Func("toolkit_29") ; setFixed(fixed?: boolean): void
$.beep := Func("toolkit_28") ; beep(): void
$.i := Func("toolkit_26") ; i(message: string): string
$.info := Func("toolkit_25") ; info(message: string, point?: Point): string
$.replace := Func("toolkit_24") ; replace( input: string, searchment: string, replacement: string, limit: number = -1 )
$.split := Func("toolkit_23") ; split(input: string, delimiter: string): string
$.toLowerCase := Func("toolkit_22") ; toLowerCase(input: string): string
$.toString := Func("toolkit_21") ; toString(input: unknown): string
$.toUpperCase := Func("toolkit_20") ; toUpperCase(input: string): string
$.trim := Func("toolkit_19") ; trim(input: string, omitting: string): string
$.trimEnd := Func("toolkit_18") ; trimEnd(input: string, omitting: string): string
$.trimStart := Func("toolkit_17") ; trimStart(input: string, omitting: string): string
$.exit := Func("toolkit_16") ; exit(): void
$.off := Func("toolkit_15") ; off(key: string, fn: Function | string): void
$.on := Func("toolkit_14") ; on(key, string, fn: Function | string): void
$.open := Func("toolkit_13") ; open(source: string): void
$.reload := Func("toolkit_12") ; reload(): void
$.sleep := Func("toolkit_11") ; sleep(time: number): void
$.suspend := Func("toolkit_10") ; suspend(suspended?: boolean): void
global Math := {abs: Func("toolkit_9"), ceil: Func("toolkit_8"), floor: Func("toolkit_7"), round: Func("toolkit_6")} ; abs(n: number): number ceil(n: number): number floor(n: number): number round(n: number): number
global alert := Func("toolkit_5") ; alert(message: string): string
global clearInterval := Func("toolkit_4") ; clearInterval(fn: Function | string): void
global clearTimeout := Func("toolkit_3") ; clearTimeout(fn: Function | string): void
global setInterval := Func("toolkit_2") ; setInterval(fn: Function | string, time: number): string
global setTimeout := Func("toolkit_1") ; setTimeout(fn: Function | string, time: number): string
toolkit_1(fn, time := 0) {
  if !(fn) {
    return fn
  }
  SetTimer, % fn, % 0 - time
  return fn
}
toolkit_2(fn, time := 0) {
  if !(fn) {
    return fn
  }
  SetTimer, % fn, % time
  return fn
}
toolkit_3(fn) {
  if !(fn) {
    return
  }
  SetTimer, % fn, Delete
}
toolkit_4(fn) {
  if !(fn) {
    return
  }
  SetTimer, % fn, Delete
}
toolkit_5(message := "") {
  if !(message) {
    return
  }
  _msg := $.toString.Call(message)
  MsgBox, % _msg
  return message
}
toolkit_6(n) {
  return Round(n)
}
toolkit_7(n) {
  return Floor(n)
}
toolkit_8(n) {
  return Ceil(n)
}
toolkit_9(n) {
  return Abs(n)
}
toolkit_10(isSuspended := "Toggle") {
  if (isSuspended != "Toggle") {
    if (isSuspended) {
      isSuspended := "On"
    } else {
      isSuspended := "Off"
    }
  }
  Suspend, % isSuspended
}
toolkit_11(time) {
  Sleep, % time
}
toolkit_12() {
  Reload
}
toolkit_13(source) {
  Run, % source
}
toolkit_14(key, fn) {
  key := $.formatHotkey.Call(key)
  Hotkey, % key, % fn, On
}
toolkit_15(key, fn) {
  key := $.formatHotkey.Call(key)
  Hotkey, % key, % fn, Off
}
toolkit_16() {
  ExitApp
}
toolkit_17(input, omitting := " `t") {
  return LTrim(input, omitting)
}
toolkit_18(input, omitting := " `t") {
  return RTrim(input, omitting)
}
toolkit_19(input, omitting := " `t") {
  return Trim(input, omitting)
}
toolkit_20(input) {
  StringUpper, __Result__, input
  return __Result__
}
toolkit_21(input) {
  _type := $.type.Call(input)
  if (_type == "array") {
    _result := ""
    for __i__, key in input {
      _result := "" . (_result) . ", " . ($.toString.Call(key)) . ""
    }
    return "[" . ($.trim.Call(_result, " ,")) . "]"
  } else if (_type == "object") {
    _result := ""
    for key, value in input {
      _result := "" . (_result) . ", " . (key) . ": " . ($.toString.Call(value)) . ""
    }
    return "{" . ($.trim.Call(_result, " ,")) . "}"
  }
  return input
}
toolkit_22(input) {
  StringLower, __Result__, input
  return __Result__
}
toolkit_23(input, delimiter) {
  return StrSplit(input, delimiter)
}
toolkit_24(input, searchment, replacement, limit := -1) {
  return StrReplace(input, searchment, replacement, limit)
}
toolkit_25(message, point := "") {
  if !(message) {
    return message
  }
  if !(point) {
    point := $.getPosition.Call()
  }
  _msg := $.toString.Call(message)
  ToolTip, % _msg, % point[1], % point[2]
  return message
}
toolkit_26(message) {
  $.info.Call("" . ($.now.Call()) . " " . ($.toString.Call(message)) . "")
  return message
}
toolkit_27() {
  SoundBeep
}
toolkit_28(n := 1) {
  SoundBeep
  __i__ := 1
  while (__i__ < n) {
    setTimeout.Call((Func("toolkit_27")).Bind(), __i__ * 1000)
    __i__++
  }
}
toolkit_29(isFixed := "Toggle") {
  if (isFixed != "Toggle") {
    if (isFixed) {
      isFixed := "On"
    } else {
      isFixed := "Off"
    }
  }
  Winset AlwaysOnTop, % isFixed, A
}
toolkit_30(listInput*) {
  if !($.length.Call(listInput)) {
    throw Exception("$.press: invalid key")
  }
  _listKey := []
  for __i__, input in listInput {
    _input := $.toLowerCase.Call(input)
    _input := $.replace.Call(_input, " ", "")
    _input := $.replace.Call(_input, "-", "")
    _list := $.split.Call(_input, "+")
    for __i__, it in _list {
      _listKey.Push(it)
    }
  }
  _listResult := []
  _len := $.length.Call(_listKey)
  for i, key in _listKey {
    if (i == _len) {
      _listResult[i] := $.split.Call(key, ":")
      continue
    }
    if ($.includes.Call(key, ":")) {
      _listResult[i] := $.split.Call(key, ":")
      _listResult[_len * 2 - i] := $.split.Call(key, ":")
    } else {
      _listResult[i] := [key, "down"]
      _listResult[_len * 2 - i] := [key, "up"]
    }
  }
  for i, it in _listResult {
    if (it[1] == "win") {
      it[1] := "lwin"
    }
    _listResult[i] := $.trim.Call("" . (it[1]) . " " . (it[2]) . "")
  }
  _output := ""
  for __i__, it in _listResult {
    _output := "" . (_output) . "{" . (it) . "}"
  }
  Send, % _output
}
toolkit_31(point := "", speed := 0) {
  if !(point) {
    throw Exception("$.move: invalid point")
  }
  MouseMove, point[1], point[2], speed
}
toolkit_32(key := "left") {
  key := $.replace.Call(key, "-", "")
  key := $.replace.Call(key, ":", " ")
  Click, % key
}
toolkit_33(min := 0, max := 1) {
  Random, __Result__, min, max
  return __Result__
}
toolkit_34() {
  return A_TickCount
}
toolkit_35(key) {
  _listKey := []
  _key := $.toLowerCase.Call(key)
  _key := $.replace.Call(_key, " ", "")
  _key := $.replace.Call(_key, "-", "")
  _list := $.split.Call(_key, "+")
  for __i__, it in _list {
    _listKey.Push(it)
  }
  _isAlt := false
  _isCtrl := false
  _isShift := false
  _isWin := false
  _listResult := []
  for __i__, key in _listKey {
    if (key == "alt") {
      _isAlt := true
      continue
    }
    if (key == "ctrl") {
      _isCtrl := true
      continue
    }
    if (key == "shift") {
      _isShift := true
      continue
    }
    if (key == "win") {
      _isWin := true
      continue
    }
    _listResult.Push(key)
  }
  _prefix := ""
  if (_isAlt) {
    _prefix := "" . (_prefix) . "!"
  }
  if (_isCtrl) {
    _prefix := "" . (_prefix) . "^"
  }
  if (_isShift) {
    _prefix := "" . (_prefix) . "+"
  }
  if (_isWin) {
    _prefix := "" . (_prefix) . "#"
  }
  _result := ""
  for __i__, it in _listResult {
    _result := "" . (_result) . " & " . (it) . ""
  }
  return $.replace.Call("" . (_prefix) . "" . ($.trim.Call(_result, " &")) . "", ":", " ")
}
toolkit_36(key) {
  return GetKeyState(key)
}
toolkit_37() {
  MouseGetPos, __X__, __Y__
  return [__X__, __Y__]
}
toolkit_38(point := "") {
  if !(point) {
    point := $.getPosition.Call()
  }
  PixelGetColor, __Result__, % point[1], % point[2], RGB
  return __Result__
}
toolkit_39(source, start := "", end := "") {
  if !(start) {
    start := [0, 0]
  }
  if !(end) {
    end := [A_ScreenWidth, A_ScreenHeight]
  }
  ImageSearch __x__, __Y__, start[1], start[2], end[1], end[2], % A_ScriptDir . "\\\" . source
  return [__X__, __Y__]
}
toolkit_40(color, start := "", end := "", variation := 0) {
  if !(start) {
    start := [0, 0]
  }
  if !(end) {
    end := [A_ScreenWidth, A_ScreenHeight]
  }
  PixelSearch __X__, __Y__, start[1], start[2], end[1], end[2], color, variation, Fast RGB
  return [__X__, __Y__]
}
toolkit_41(input) {
  if input is Number
    return "number"
  if (IsObject(input)) {
    if (input.Count() == input.Length()) {
      return "array"
    }
    return "object"
  }
  return "string"
}
toolkit_42(input) {
  _type := $.type.Call(input)
  switch _type {
    case "array": {
      return input.Length()
    }
    case "object": {
      return input.Count()
    }
    case "string": {
      return StrLen(input)
    }
    default: {
      throw Exception("$.length: invalid type '" . (_type) . "'")
    }
  }
}
toolkit_43(input, needle) {
  _type := $.type.Call(input)
  if (_type == "string" || _type == "number") {
    return (InStr(input, needle)) > 0
  }
  if (_type == "array") {
    for __i__, it in input {
      if (it == needle) {
        return true
      }
    }
    return false
  }
  throw Exception("$.includes: invalid type '" . (_type) . "'")
}
toolkit_44(input) {
  _type := $.type.Call(input)
  if !(_type == "array") {
    throw Exception("$.reverse: invalid type '" . (_type) . "'")
  }
  _len := $.length.Call(input)
  _output := []
  for i, key in input {
    _output[_len - i + 1] := key
  }
  return _output
}

$.on.Call("1", Func("02lrqv5ij9m_1"))
02lrqv5ij9m_1() {
  $.beep.Call(5)
}
