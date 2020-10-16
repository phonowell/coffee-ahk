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
$.reverse := Func("anonymous_46") ; reverse(input: unknown[]): unknown[]
$.includes := Func("anonymous_45")
$.length := Func("anonymous_44") ; length(input: string | array | object): number
$.type := Func("anonymous_43") ; type(input: unknown): 'array' | 'number' | 'object' | 'string'
$.findColor := Func("anonymous_42") ; findColor( color: number, start: Point = [0, 0], end: Point = [A_ScreenWidth, A_ScreenHeight], variation = 0 ): Point
$.findImage := Func("anonymous_41") ; findImage( source: string, start: Point = [0, 0], end: Point = [A_ScreenWidth, A_ScreenHeight], ): Point
$.getColor := Func("anonymous_40") ; getColor(point?: Point): number
$.getPosition := Func("anonymous_39") ; getPosition(): Point
$.getState := Func("anonymous_38") ; getState(key: string): string
$.formatHotkey := Func("anonymous_37") ; formatHotkey(key: string): string
$.now := Func("anonymous_36") ; now(): number
$.random := Func("anonymous_35") ; random(min: number = 0, max: number = 1): number
$.click := Func("anonymous_34") ; click(key?: string): void
$.move := Func("anonymous_33") ; move(point: Point, speed: number = 0): void
$.press := Func("anonymous_32") ; press(key...: string): void
$.setFixed := Func("anonymous_31") ; setFixed(fixed?: boolean): void
$.beep := Func("anonymous_30") ; beep(): void
$.info := Func("anonymous_29") ; info(message: string, point?: Point): string
$.replace := Func("anonymous_28") ; replace( input: string, searchment: string, replacement: string, limit: number = -1 )
$.split := Func("anonymous_27") ; split(input: string, delimiter: string): string
$.toLowerCase := Func("anonymous_26") ; toLowerCase(input: string): string
$.toString := Func("anonymous_25") ; toString(input: unknown): string
$.toUpperCase := Func("anonymous_24") ; toUpperCase(input: string): string
$.trim := Func("anonymous_23") ; trim(input: string, omitting: string): string
$.trimEnd := Func("anonymous_22") ; trimEnd(input: string, omitting: string): string
$.trimStart := Func("anonymous_21") ; trimStart(input: string, omitting: string): string
$.exit := Func("anonymous_20") ; exit(): void
$.off := Func("anonymous_19") ; off(key: string, fn: Function | string): void
$.on := Func("anonymous_18") ; on(key, string, fn: Function | string): void
$.open := Func("anonymous_17") ; open(source: string): void
$.pause := Func("anonymous_16") ; pause(paused?: boolean): void
$.reload := Func("anonymous_15") ; reload(): void
$.sleep := Func("anonymous_14") ; sleep(time: number): void
global Math := {abs: Func("anonymous_13"), ceil: Func("anonymous_12"), floor: Func("anonymous_11"), round: Func("anonymous_10")} ; abs(n: number): number ceil(n: number): number floor(n: number): number round(n: number): number
global alert := Func("anonymous_9") ; alert(message: string): string
global clearInterval := Func("anonymous_8") ; clearInterval(fn: Function | string): void
global clearTimeout := Func("anonymous_7") ; clearTimeout(fn: Function | string): void
global setInterval := Func("anonymous_6") ; setInterval(fn: Function | string, time: number): string
global setTimeout := Func("anonymous_5") ; setTimeout(fn: Function | string, time: number): string
global timer := ""
$.on.Call("win + n", "anonymous_4")
$.on.Call("esc", "anonymous_2")
$.on.Call("alt + f4", "anonymous_1")
anonymous_1() {
  $.exit.Call()
}
anonymous_2() {
  clearTimeout.Call(timer)
}
anonymous_3() {
  $.open.Call("notepad.exe")
}
anonymous_4() {
  clearTimeout.Call(timer)
  timer := setTimeout.Call("anonymous_3", 1000)
}
anonymous_5(fn, time := 0) {
  if !(fn) {
    return fn
  }
  SetTimer, % fn, % 0 - time
  return fn
}
anonymous_6(fn, time := 0) {
  if !(fn) {
    return fn
  }
  SetTimer, % fn, % time
  return fn
}
anonymous_7(fn) {
  if !(fn) {
    return
  }
  SetTimer, % fn, Delete
}
anonymous_8(fn) {
  if !(fn) {
    return
  }
  SetTimer, % fn, Delete
}
anonymous_9(message := "") {
  if !(message) {
    return
  }
  msg := $.toString.Call(message)
  MsgBox, % msg
  return message
}
anonymous_10(n) {
  return Round(n)
}
anonymous_11(n) {
  return Floor(n)
}
anonymous_12(n) {
  return Ceil(n)
}
anonymous_13(n) {
  return Abs(n)
}
anonymous_14(time) {
  Sleep, % time
}
anonymous_15() {
  Reload
}
anonymous_16(isPaused := "Toggle") {
  if (isPaused != "Toggle") {
    if (isPaused) {
      isPaused := "On"
    } else {
      isPaused := "Off"
    }
  }
  Pause, % isPaused
}
anonymous_17(source) {
  Run, % source
}
anonymous_18(key, fn) {
  key := $.formatHotkey.Call(key)
  Hotkey, % key, % fn, On
}
anonymous_19(key, fn) {
  key := $.formatHotkey.Call(key)
  Hotkey, % key, % fn, Off
}
anonymous_20() {
  ExitApp
}
anonymous_21(input, omitting := " `t") {
  return LTrim(input, omitting)
}
anonymous_22(input, omitting := " `t") {
  return RTrim(input, omitting)
}
anonymous_23(input, omitting := " `t") {
  return Trim(input, omitting)
}
anonymous_24(input) {
  StringUpper, __Result__, input
  return __Result__
}
anonymous_25(input) {
  type := $.type.Call(input)
  if (type == "array") {
    result := ""
    for __i__, key in input {
      result := "" . (result) . ", " . ($.toString.Call(key)) . ""
    }
    return "[" . ($.trim.Call(result, " ,")) . "]"
  } else if (type == "object") {
    result := ""
    for key, value in input {
      result := "" . (result) . ", " . (key) . ": " . ($.toString.Call(value)) . ""
    }
    return "{" . ($.trim.Call(result, " ,")) . "}"
  }
  return input
}
anonymous_26(input) {
  StringLower, __Result__, input
  return __Result__
}
anonymous_27(input, delimiter) {
  return StrSplit(input, delimiter)
}
anonymous_28(input, searchment, replacement, limit := -1) {
  return StrReplace(input, searchment, replacement, limit)
}
anonymous_29(message, point := "") {
  if !(message) {
    return
  }
  if !(point) {
    point := $.getPosition.Call()
  }
  msg := $.toString.Call(message)
  ToolTip, % msg, % point[1], % point[2]
  return message
}
anonymous_30() {
  SoundBeep
}
anonymous_31(isFixed := "Toggle") {
  if (isFixed != "Toggle") {
    if (isFixed) {
      isFixed := "On"
    } else {
      isFixed := "Off"
    }
  }
  Winset AlwaysOnTop, % isFixed, A
}
anonymous_32(listInput*) {
  if !($.length.Call(listInput)) { ; validate
    throw Exception("$.press: invalid key")
  }
  listKey := [] ; format
  for __i__, input in listInput {
    _input := $.toLowerCase.Call(input)
    _input := $.replace.Call(_input, " ", "")
    _input := $.replace.Call(_input, "-", "")
    _list := $.split.Call(_input, "+")
    for __i__, _it in _list {
      listKey.Push(_it)
    }
  }
  listResult := [] ; unfold
  len := $.length.Call(listKey)
  for i, key in listKey {
    if (i == len) { ; last
      listResult[i] := $.split.Call(key, ":")
      continue
    }
    if ($.includes.Call(key, ":")) { ; other
      listResult[i] := $.split.Call(key, ":")
      listResult[len * 2 - i] := $.split.Call(key, ":")
    } else {
      listResult[i] := [key, "down"]
      listResult[len * 2 - i] := [key, "up"]
    }
  }
  for i, it in listResult {
    if (it[1] == "win") {
      it[1] := "lwin"
    }
    listResult[i] := $.trim.Call("" . (it[1]) . " " . (it[2]) . "")
  }
  output := "" ; execute
  for __i__, it in listResult {
    output := "" . (output) . "{" . (it) . "}"
  }
  Send, % output
}
anonymous_33(point := "", speed := 0) {
  if !(point) {
    throw Exception("$.move: invalid point")
  }
  MouseMove, point[1], point[2], speed
}
anonymous_34(key := "left") {
  key := $.replace.Call(key, "-", "")
  key := $.replace.Call(key, ":", " ")
  Click, % key
}
anonymous_35(min := 0, max := 1) {
  Random, __Result__, min, max
  return __Result__
}
anonymous_36() {
  return A_TickCount
}
anonymous_37(key) {
  listKey := [] ; format
  _key := $.toLowerCase.Call(key)
  _key := $.replace.Call(_key, " ", "")
  _key := $.replace.Call(_key, "-", "")
  _list := $.split.Call(_key, "+")
  for __i__, _it in _list {
    listKey.Push(_it)
  }
  isAlt := false ; unfold
  isCtrl := false
  isShift := false
  isWin := false
  listResult := []
  for __i__, key in listKey {
    if (key == "alt") {
      isAlt := true
      continue
    }
    if (key == "ctrl") {
      isCtrl := true
      continue
    }
    if (key == "shift") {
      isShift := true
      continue
    }
    if (key == "win") {
      isWin := true
      continue
    }
    listResult.Push(key)
  }
  prefix := ""
  if (isAlt) {
    prefix := "" . (prefix) . "!"
  }
  if (isCtrl) {
    prefix := "" . (prefix) . "^"
  }
  if (isShift) {
    prefix := "" . (prefix) . "+"
  }
  if (isWin) {
    prefix := "" . (prefix) . "#"
  }
  result := ""
  for __i__, it in listResult {
    result := "" . (result) . " & " . (it) . ""
  }
  return $.replace.Call("" . (prefix) . "" . ($.trim.Call(result, " &")) . "", ":", " ")
}
anonymous_38(key) {
  return GetKeyState(key)
}
anonymous_39() {
  MouseGetPos, __X__, __Y__
  return [__X__, __Y__]
}
anonymous_40(point := "") {
  if !(point) {
    point := $.getPosition.Call()
  }
  PixelGetColor, __Result__, % point[1], % point[2], RGB
  return __Result__
}
anonymous_41(source, start := "", end := "") {
  if !(start) {
    start := [0, 0]
  }
  if !(end) {
    end := [A_ScreenWidth, A_ScreenHeight]
  }
  ImageSearch __x__, __Y__, start[1], start[2], end[1], end[2], % A_ScriptDir . "\\\" . source
  return [__X__, __Y__]
}
anonymous_42(color, start := "", end := "", variation := 0) {
  if !(start) {
    start := [0, 0]
  }
  if !(end) {
    end := [A_ScreenWidth, A_ScreenHeight]
  }
  PixelSearch __X__, __Y__, start[1], start[2], end[1], end[2], color, variation, Fast RGB
  return [__X__, __Y__]
}
anonymous_43(input) {
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
anonymous_44(input) {
  type := $.type.Call(input)
  switch type {
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
      throw Exception("$.length: invalid type '" . (type) . "'")
    }
  }
}
anonymous_45(input, needle) {
  type := $.type.Call(input)
  if (type == "string" || type == "number") {
    return (InStr(input, needle)) > 0
  }
  if (type == "array") {
    for __i__, it in input {
      if (it == needle) {
        return true
      }
    }
    return false
  }
  throw Exception("$.includes: invalid type '" . (type) . "'")
}
anonymous_46(input) {
  type := $.type.Call(input)
  if !(type == "array") {
    throw Exception("$.reverse: invalid type '" . (type) . "'")
  }
  len := $.length.Call(input)
  output := []
  for i, key in input {
    output[len - i + 1] := key
  }
  return output
}
