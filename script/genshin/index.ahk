if (A_IsAdmin != true) {
  Run *RunAs "%A_ScriptFullPath%"
  ExitApp
}
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
$.reverse := Func("anonymous_63") ; reverse(input: unknown[]): unknown[]
$.includes := Func("anonymous_62")
$.length := Func("anonymous_61") ; length(input: string | array | object): number
$.type := Func("anonymous_60") ; type(input: unknown): 'array' | 'number' | 'object' | 'string'
$.findColor := Func("anonymous_59") ; findColor( ; color: number, ; start: Point = [0, 0], ; end: Point = [A_ScreenWidth, A_ScreenHeight], ; variation = 0 ; ): Point
$.findImage := Func("anonymous_58") ; findImage( ; source: string, ; start: Point = [0, 0], ; end: Point = [A_ScreenWidth, A_ScreenHeight], ; ): Point
$.getColor := Func("anonymous_57") ; getColor(point?: Point): number
$.getPosition := Func("anonymous_56") ; getPosition(): Point
$.getState := Func("anonymous_55") ; getState(key: string): string
$.formatHotkey := Func("anonymous_54") ; formatHotkey(key: string): string
$.now := Func("anonymous_53") ; now(): number
$.random := Func("anonymous_52") ; random(min: number = 0, max: number = 1): number
$.click := Func("anonymous_51") ; click(key?: string): void
$.move := Func("anonymous_50") ; move(point: Point, speed: number = 0): void
$.press := Func("anonymous_49") ; press(key...: string): void
$.setFixed := Func("anonymous_48") ; setFixed(fixed?: boolean): void
$.beep := Func("anonymous_47") ; beep(): void
$.info := Func("anonymous_46") ; info(message: string, point?: Point): string
$.replace := Func("anonymous_45") ; replace( ; input: string, ; searchment: string, ; replacement: string, ; limit: number = -1 ; )
$.split := Func("anonymous_44") ; split(input: string, delimiter: string): string
$.toLowerCase := Func("anonymous_43") ; toLowerCase(input: string): string
$.toString := Func("anonymous_42") ; toString(input: unknown): string
$.toUpperCase := Func("anonymous_41") ; toUpperCase(input: string): string
$.trim := Func("anonymous_40") ; trim(input: string, omitting: string): string
$.trimEnd := Func("anonymous_39") ; trimEnd(input: string, omitting: string): string
$.trimStart := Func("anonymous_38") ; trimStart(input: string, omitting: string): string
$.exit := Func("anonymous_37") ; exit(): void
$.off := Func("anonymous_36") ; off(key: string, fn: Function | string): void
$.on := Func("anonymous_35") ; on(key, string, fn: Function | string): void
$.open := Func("anonymous_34") ; open(source: string): void
$.pause := Func("anonymous_33") ; pause(paused?: boolean): void
$.reload := Func("anonymous_32") ; reload(): void
$.sleep := Func("anonymous_31") ; sleep(time: number): void
global Math := {abs: Func("anonymous_30"), ceil: Func("anonymous_29"), floor: Func("anonymous_28"), round: Func("anonymous_27")} ; abs(n: number): number ; ceil(n: number): number ; floor(n: number): number ; round(n: number): number
global alert := Func("anonymous_26") ; alert(message: string): string
global clearInterval := Func("anonymous_25") ; clearInterval(fn: Function | string): void
global clearTimeout := Func("anonymous_24") ; clearTimeout(fn: Function | string): void
global setInterval := Func("anonymous_23") ; setInterval(fn: Function | string, time: number): string
global setTimeout := Func("anonymous_22") ; setTimeout(fn: Function | string, time: number): string
global isPicking := false ; variable
global stepPick := 0
global timer := ""
global jump := Func("anonymous_21") ; function
global useE := Func("anonymous_20")
$.on.Call("alt + f4", "anonymous_19") ; binding
$.on.Call("f12", "anonymous_18")
$.on.Call("1", "anonymous_17")
$.on.Call("2", "anonymous_16")
$.on.Call("3", "anonymous_15")
$.on.Call("4", "anonymous_14")
$.on.Call("5", "anonymous_13")
$.on.Call("f", "anonymous_12")
$.on.Call("space", "anonymous_1")
anonymous_1() {
  clearTimeout.Call(timer)
  jump.Call()
  timer := setTimeout.Call(jump, 200)
}
anonymous_2() {
  $.press.Call("f")
  $.click.Call("wheel-down:up")
}
anonymous_3() {
  $.press.Call("f")
  $.click.Call("wheel-down:down")
}
anonymous_4() {
  $.press.Call("f")
  $.click.Call("wheel-down:down")
}
anonymous_5() {
  $.press.Call("f")
  $.click.Call("wheel-down:down")
}
anonymous_6() {
  $.press.Call("f")
  $.click.Call("wheel-down:down")
}
anonymous_7() {
  $.press.Call("f")
  $.click.Call("wheel-down:down")
}
anonymous_8() {
  $.press.Call("f")
  $.click.Call("wheel-down:down")
}
anonymous_9() {
  $.press.Call("f")
  $.click.Call("wheel-down:down")
}
anonymous_10() {
  $.press.Call("f")
  $.click.Call("wheel-down:down")
}
anonymous_11() {
  $.press.Call("f")
  $.click.Call("wheel-down:down")
}
anonymous_12() {
  $.press.Call("f")
  $.click.Call("wheel-down:down")
  setTimeout.Call("anonymous_11", 100)
  setTimeout.Call("anonymous_10", 200)
  setTimeout.Call("anonymous_9", 300)
  setTimeout.Call("anonymous_8", 400)
  setTimeout.Call("anonymous_7", 500)
  setTimeout.Call("anonymous_6", 600)
  setTimeout.Call("anonymous_5", 700)
  setTimeout.Call("anonymous_4", 800)
  setTimeout.Call("anonymous_3", 900)
  setTimeout.Call("anonymous_2", 1000)
}
anonymous_13() {
  clearTimeout.Call(timer)
  $.press.Call("5")
  timer := setTimeout.Call(useE, 100)
}
anonymous_14() {
  clearTimeout.Call(timer)
  $.press.Call("4")
  timer := setTimeout.Call(useE, 100)
}
anonymous_15() {
  clearTimeout.Call(timer)
  $.press.Call("3")
  timer := setTimeout.Call(useE, 100)
}
anonymous_16() {
  clearTimeout.Call(timer)
  $.press.Call("2")
  timer := setTimeout.Call(useE, 100)
}
anonymous_17() {
  clearTimeout.Call(timer)
  $.press.Call("1")
  timer := setTimeout.Call(useE, 100)
}
anonymous_18() {
  $.beep.Call()
  $.pause.Call()
}
anonymous_19() {
  $.beep.Call()
  $.exit.Call()
}
anonymous_20() {
  $.press.Call("e")
}
anonymous_21() {
  $.press.Call("space")
}
anonymous_22(fn, time := 0) {
  if !(fn) {
    return fn
  }
  SetTimer, % fn, % 0 - time
  return fn
}
anonymous_23(fn, time := 0) {
  if !(fn) {
    return fn
  }
  SetTimer, % fn, % time
  return fn
}
anonymous_24(fn) {
  if !(fn) {
    return
  }
  SetTimer, % fn, Delete
}
anonymous_25(fn) {
  if !(fn) {
    return
  }
  SetTimer, % fn, Delete
}
anonymous_26(message := "") {
  if !(message) {
    return
  }
  msg := $.toString.Call(message)
  MsgBox, % msg
  return message
}
anonymous_27(n) {
  return Round(n)
}
anonymous_28(n) {
  return Floor(n)
}
anonymous_29(n) {
  return Ceil(n)
}
anonymous_30(n) {
  return Abs(n)
}
anonymous_31(time) {
  Sleep, % time
}
anonymous_32() {
  Reload
}
anonymous_33(isPaused := "Toggle") {
  if (isPaused != "Toggle") {
    if (isPaused) {
      isPaused := "On"
    } else {
      isPaused := "Off"
    }
  }
  Pause, % isPaused
}
anonymous_34(source) {
  Run, % source
}
anonymous_35(key, fn) {
  key := $.formatHotkey.Call(key)
  Hotkey, % key, % fn, On
}
anonymous_36(key, fn) {
  key := $.formatHotkey.Call(key)
  Hotkey, % key, % fn, Off
}
anonymous_37() {
  ExitApp
}
anonymous_38(input, omitting := " `t") {
  return LTrim(input, omitting)
}
anonymous_39(input, omitting := " `t") {
  return RTrim(input, omitting)
}
anonymous_40(input, omitting := " `t") {
  return Trim(input, omitting)
}
anonymous_41(input) {
  StringUpper, __Result__, input
  return __Result__
}
anonymous_42(input) {
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
anonymous_43(input) {
  StringLower, __Result__, input
  return __Result__
}
anonymous_44(input, delimiter) {
  return StrSplit(input, delimiter)
}
anonymous_45(input, searchment, replacement, limit := -1) {
  return StrReplace(input, searchment, replacement, limit)
}
anonymous_46(message, point := "") {
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
anonymous_47() {
  SoundBeep
}
anonymous_48(isFixed := "Toggle") {
  if (isFixed != "Toggle") {
    if (isFixed) {
      isFixed := "On"
    } else {
      isFixed := "Off"
    }
  }
  Winset AlwaysOnTop, % isFixed, A
}
anonymous_49(listInput*) {
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
anonymous_50(point := "", speed := 0) {
  if !(point) {
    throw Exception("$.move: invalid point")
  }
  MouseMove, point[1], point[2], speed
}
anonymous_51(key := "left") {
  key := $.replace.Call(key, "-", "")
  key := $.replace.Call(key, ":", " ")
  Click, % key
}
anonymous_52(min := 0, max := 1) {
  Random, __Result__, min, max
  return __Result__
}
anonymous_53() {
  return A_TickCount
}
anonymous_54(key) {
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
anonymous_55(key) {
  return GetKeyState(key)
}
anonymous_56() {
  MouseGetPos, __X__, __Y__
  return [__X__, __Y__]
}
anonymous_57(point := "") {
  if !(point) {
    point := $.getPosition.Call()
  }
  PixelGetColor, __Result__, % point[1], % point[2], RGB
  return __Result__
}
anonymous_58(source, start := "", end := "") {
  if !(start) {
    start := [0, 0]
  }
  if !(end) {
    end := [A_ScreenWidth, A_ScreenHeight]
  }
  ImageSearch __x__, __Y__, start[1], start[2], end[1], end[2], % A_ScriptDir . "\\\" . source
  return [__X__, __Y__]
}
anonymous_59(color, start := "", end := "", variation := 0) {
  if !(start) {
    start := [0, 0]
  }
  if !(end) {
    end := [A_ScreenWidth, A_ScreenHeight]
  }
  PixelSearch __X__, __Y__, start[1], start[2], end[1], end[2], color, variation, Fast RGB
  return [__X__, __Y__]
}
anonymous_60(input) {
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
anonymous_61(input) {
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
anonymous_62(input, needle) {
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
anonymous_63(input) {
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
