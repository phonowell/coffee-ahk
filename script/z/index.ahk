#KeyHistory, 0
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
global $ := {}
$.reverse := Func("h5vo8andlu8_42") ; reverse(input: unknown[]): unknown[]
$.includes := Func("h5vo8andlu8_41")
$.length := Func("h5vo8andlu8_40") ; length(input: string | array | object): number
$.type := Func("h5vo8andlu8_39") ; type(input: unknown): 'array' | 'number' | 'object' | 'string'
$.findColor := Func("h5vo8andlu8_38") ; findColor( color: number, start: Point = [0, 0], end: Point = [A_ScreenWidth, A_ScreenHeight], variation = 0 ): Point
$.findImage := Func("h5vo8andlu8_37") ; findImage( source: string, start: Point = [0, 0], end: Point = [A_ScreenWidth, A_ScreenHeight], ): Point
$.getColor := Func("h5vo8andlu8_36") ; getColor(point?: Point): number
$.getPosition := Func("h5vo8andlu8_35") ; getPosition(): Point
$.getState := Func("h5vo8andlu8_34") ; getState(key: string): string
$.formatHotkey := Func("h5vo8andlu8_33") ; formatHotkey(key: string): string
$.now := Func("h5vo8andlu8_32") ; now(): number
$.random := Func("h5vo8andlu8_31") ; random(min: number = 0, max: number = 1): number
$.click := Func("h5vo8andlu8_30") ; click(key?: string): void
$.move := Func("h5vo8andlu8_29") ; move(point: Point, speed: number = 0): void
$.press := Func("h5vo8andlu8_28") ; press(key...: string): void
$.setFixed := Func("h5vo8andlu8_27") ; setFixed(fixed?: boolean): void
$.beep := Func("h5vo8andlu8_26") ; beep(): void
$.info := Func("h5vo8andlu8_25") ; info(message: string, point?: Point): string
$.replace := Func("h5vo8andlu8_24") ; replace( input: string, searchment: string, replacement: string, limit: number = -1 )
$.split := Func("h5vo8andlu8_23") ; split(input: string, delimiter: string): string
$.toLowerCase := Func("h5vo8andlu8_22") ; toLowerCase(input: string): string
$.toString := Func("h5vo8andlu8_21") ; toString(input: unknown): string
$.toUpperCase := Func("h5vo8andlu8_20") ; toUpperCase(input: string): string
$.trim := Func("h5vo8andlu8_19") ; trim(input: string, omitting: string): string
$.trimEnd := Func("h5vo8andlu8_18") ; trimEnd(input: string, omitting: string): string
$.trimStart := Func("h5vo8andlu8_17") ; trimStart(input: string, omitting: string): string
$.exit := Func("h5vo8andlu8_16") ; exit(): void
$.off := Func("h5vo8andlu8_15") ; off(key: string, fn: Function | string): void
$.on := Func("h5vo8andlu8_14") ; on(key, string, fn: Function | string): void
$.open := Func("h5vo8andlu8_13") ; open(source: string): void
$.reload := Func("h5vo8andlu8_12") ; reload(): void
$.sleep := Func("h5vo8andlu8_11") ; sleep(time: number): void
$.suspend := Func("h5vo8andlu8_10") ; suspend(suspended?: boolean): void
global Math := {abs: Func("h5vo8andlu8_9"), ceil: Func("h5vo8andlu8_8"), floor: Func("h5vo8andlu8_7"), round: Func("h5vo8andlu8_6")} ; abs(n: number): number ceil(n: number): number floor(n: number): number round(n: number): number
global alert := Func("h5vo8andlu8_5") ; alert(message: string): string
global clearInterval := Func("h5vo8andlu8_4") ; clearInterval(fn: Function | string): void
global clearTimeout := Func("h5vo8andlu8_3") ; clearTimeout(fn: Function | string): void
global setInterval := Func("h5vo8andlu8_2") ; setInterval(fn: Function | string, time: number): string
global setTimeout := Func("h5vo8andlu8_1") ; setTimeout(fn: Function | string, time: number): string
h5vo8andlu8_1(fn, time := 0) {
  if !(fn) {
    return fn
  }
  SetTimer, % fn, % 0 - time
  return fn
}
h5vo8andlu8_2(fn, time := 0) {
  if !(fn) {
    return fn
  }
  SetTimer, % fn, % time
  return fn
}
h5vo8andlu8_3(fn) {
  if !(fn) {
    return
  }
  SetTimer, % fn, Delete
}
h5vo8andlu8_4(fn) {
  if !(fn) {
    return
  }
  SetTimer, % fn, Delete
}
h5vo8andlu8_5(message := "") {
  if !(message) {
    return
  }
  _msg := $.toString.Call(message)
  MsgBox, % _msg
  return message
}
h5vo8andlu8_6(n) {
  return Round(n)
}
h5vo8andlu8_7(n) {
  return Floor(n)
}
h5vo8andlu8_8(n) {
  return Ceil(n)
}
h5vo8andlu8_9(n) {
  return Abs(n)
}
h5vo8andlu8_10(isSuspended := "Toggle") {
  if (isSuspended != "Toggle") {
    if (isSuspended) {
      isSuspended := "On"
    } else {
      isSuspended := "Off"
    }
  }
  Suspend, % isSuspended
}
h5vo8andlu8_11(time) {
  Sleep, % time
}
h5vo8andlu8_12() {
  Reload
}
h5vo8andlu8_13(source) {
  Run, % source
}
h5vo8andlu8_14(key, fn) {
  key := $.formatHotkey.Call(key)
  Hotkey, % key, % fn, On
}
h5vo8andlu8_15(key, fn) {
  key := $.formatHotkey.Call(key)
  Hotkey, % key, % fn, Off
}
h5vo8andlu8_16() {
  ExitApp
}
h5vo8andlu8_17(input, omitting := " `t") {
  return LTrim(input, omitting)
}
h5vo8andlu8_18(input, omitting := " `t") {
  return RTrim(input, omitting)
}
h5vo8andlu8_19(input, omitting := " `t") {
  return Trim(input, omitting)
}
h5vo8andlu8_20(input) {
  StringUpper, __Result__, input
  return __Result__
}
h5vo8andlu8_21(input) {
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
h5vo8andlu8_22(input) {
  StringLower, __Result__, input
  return __Result__
}
h5vo8andlu8_23(input, delimiter) {
  return StrSplit(input, delimiter)
}
h5vo8andlu8_24(input, searchment, replacement, limit := -1) {
  return StrReplace(input, searchment, replacement, limit)
}
h5vo8andlu8_25(message, point := "") {
  if !(message) {
    return
  }
  if !(point) {
    point := $.getPosition.Call()
  }
  _msg := $.toString.Call(message)
  ToolTip, % _msg, % point[1], % point[2]
  return message
}
h5vo8andlu8_26() {
  SoundBeep
}
h5vo8andlu8_27(isFixed := "Toggle") {
  if (isFixed != "Toggle") {
    if (isFixed) {
      isFixed := "On"
    } else {
      isFixed := "Off"
    }
  }
  Winset AlwaysOnTop, % isFixed, A
}
h5vo8andlu8_28(listInput*) {
  if !($.length.Call(listInput)) { ; validate
    throw Exception("$.press: invalid key")
  }
  _listKey := [] ; format
  for __i__, input in listInput {
    _input := $.toLowerCase.Call(input)
    _input := $.replace.Call(_input, " ", "")
    _input := $.replace.Call(_input, "-", "")
    _list := $.split.Call(_input, "+")
    for __i__, it in _list {
      _listKey.Push(it)
    }
  }
  _listResult := [] ; unfold
  _len := $.length.Call(_listKey)
  for i, key in _listKey {
    if (i == _len) { ; last
      _listResult[i] := $.split.Call(key, ":")
      continue
    }
    if ($.includes.Call(key, ":")) { ; other
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
  _output := "" ; execute
  for __i__, it in _listResult {
    _output := "" . (_output) . "{" . (it) . "}"
  }
  Send, % _output
}
h5vo8andlu8_29(point := "", speed := 0) {
  if !(point) {
    throw Exception("$.move: invalid point")
  }
  MouseMove, point[1], point[2], speed
}
h5vo8andlu8_30(key := "left") {
  key := $.replace.Call(key, "-", "")
  key := $.replace.Call(key, ":", " ")
  Click, % key
}
h5vo8andlu8_31(min := 0, max := 1) {
  Random, __Result__, min, max
  return __Result__
}
h5vo8andlu8_32() {
  return A_TickCount
}
h5vo8andlu8_33(key) {
  _listKey := [] ; format
  _key := $.toLowerCase.Call(key)
  _key := $.replace.Call(_key, " ", "")
  _key := $.replace.Call(_key, "-", "")
  _list := $.split.Call(_key, "+")
  for __i__, it in _list {
    _listKey.Push(it)
  }
  _isAlt := false ; unfold
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
h5vo8andlu8_34(key) {
  return GetKeyState(key)
}
h5vo8andlu8_35() {
  MouseGetPos, __X__, __Y__
  return [__X__, __Y__]
}
h5vo8andlu8_36(point := "") {
  if !(point) {
    point := $.getPosition.Call()
  }
  PixelGetColor, __Result__, % point[1], % point[2], RGB
  return __Result__
}
h5vo8andlu8_37(source, start := "", end := "") {
  if !(start) {
    start := [0, 0]
  }
  if !(end) {
    end := [A_ScreenWidth, A_ScreenHeight]
  }
  ImageSearch __x__, __Y__, start[1], start[2], end[1], end[2], % A_ScriptDir . "\\\" . source
  return [__X__, __Y__]
}
h5vo8andlu8_38(color, start := "", end := "", variation := 0) {
  if !(start) {
    start := [0, 0]
  }
  if !(end) {
    end := [A_ScreenWidth, A_ScreenHeight]
  }
  PixelSearch __X__, __Y__, start[1], start[2], end[1], end[2], color, variation, Fast RGB
  return [__X__, __Y__]
}
h5vo8andlu8_39(input) {
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
h5vo8andlu8_40(input) {
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
h5vo8andlu8_41(input, needle) {
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
h5vo8andlu8_42(input) {
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

global id := WinExist("A")
global isSuspend := false
setInterval.Call("06adfk0ndl6_2", 200)
$.on.Call("1", "06adfk0ndl6_1")
06adfk0ndl6_1() {
  alert.Call(1)
}
06adfk0ndl6_2() {
  if (!isSuspend && !WinActive("ahk_id " . (id) . "")) {
    $.suspend.Call(true)
    isSuspend := true
    return
  }
  if (isSuspend && WinActive("ahk_id " . (id) . "")) {
    $.suspend.Call(false)
    isSuspend := false
    return
  }
}
