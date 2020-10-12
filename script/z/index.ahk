
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

class MathToolkit {
  abs(n) { ; abs(n: number): number
    return Abs(n)
  }
  ceil(n) { ; ceil(n: number): number
    return Ceil(n)
  }
  floor(n) { ; floor(n: number): number
    return Floor(n)
  }
  round(n) { ; round(n: number): number
    return Round(n)
  }
}
global Math := new MathToolkit()
class BasicToolkit {
  length(input) { ; length(input: string | array | object): number
    type := $.type(input)
    if (type == "string") {
      return StrLen(input)
    } else if (type == "object") {
      return input.Length()
    } else {
      throw Exception("$.length: invalid type '" . (type) . "'")
    }
  }
  type(input) { ; type(input: unknown): 'number' | 'object' | 'string'
    if input is Number
      return "number"
    if (IsObject(input)) {
      return "object"
    }
    return "string"
  }
}
class FinderToolkit extends basicToolkit {
  findColor(color := "", start := "", end := "", variation := 0) { ; findColor( ; color: number, ; start: Point = [0, 0], ; end: Point = [A_ScreenWidth, A_ScreenHeight], ; variation = 0 ; ): Point
    if !(color) {
      throw Exception("$.findColor: invalid color")
    }
    if !(start) {
      start := [0, 0]
    }
    if !(end) {
      end := [A_ScreenWidth, A_ScreenHeight]
    }
    PixelSearch __X__, __Y__, start[1], start[2], end[1], end[2], color, variation, Fast RGB
    return [__X__, __Y__]
  }
}
class GetterToolkit extends finderToolkit {
  getColor(point := "") { ; getColor(point?: Point): number
    if !(point) {
      point := $.getPosition()
    }
    PixelGetColor, __Result__, % point[1], % point[2], RGB
    return __Result__
  }
  getPosition() { ; getPosition(): Point
    MouseGetPos, __X__, __Y__
    return [__X__, __Y__]
  }
  getState(key) { ; getState(key: string): string
    return GetKeyState(key)
  }
}
class OtherToolkit extends GetterToolkit {
  now() { ; now(): number
    return A_TickCount
  }
  random(min := 0, max := 1) { ; random(min: number = 0, max: number = 1): number
    Random, __Result__, min, max
    return __Result__
  }
}
class SetterToolkit extends OtherToolkit {
  click(input := "") { ; click(input?: string): void
    if !(input) {
      Click
      return
    }
    Click, % StrReplace input, ":", " "
  }
  move(point := "", speed := 0) { ; move(point: Point, speed: number = 0): void
    if !(point) {
      throw Exception("$.move: invalid point")
    }
    MouseMove, point[1], point[2], speed
  }
}
class SpeakerToolkit extends SetterToolkit {
  alert(message := "") { ; alert(message: string): string
    if !(message) {
      return
    }
    msg := $.toString(message)
    MsgBox, % msg
    return message
  }
  beep() { ; beep(): void
    SoundBeep
  }
  info(message := "", point := "") { ; info(message: string, point?: Point): string
    if !(message) {
      return
    }
    if !(point) {
      point := $.getPosition()
    }
    msg := $.toString(message)
    ToolTip, % msg, % point[1], % point[2]
    return message
  }
}
class StringToolkit extends SpeakerToolkit {
  replace(input, searchment, replacement, limit := -1) { ; replace( ; input: string, ; searchment: string, ; replacement: string, ; limit: number = -1 ; )
    return StrReplace(input, searchment, replacement, limit)
  }
  toLowerCase(input) { ; toLowerCase(input: string): string
    StringLower, __Result__, input
    return __Result__
  }
  toString(input) { ; toString(input: unknown): string
    type := $.type(input)
    if (type == "object") {
      result := ""
      for key, value in input {
        result := "" . (result) . ", " . (key) . ": " . (value) . ""
      }
      return "{" . ($.trim(result, " ,")) . "}"
    }
    return input
  }
  toUpperCase(input) { ; toUpperCase(input: string): string
    StringUpper, __Result__, input
    return __Result__
  }
  trim(input, omitting := " `t") { ; trim(input: string, omitting: string): string
    return Trim(input, omitting)
  }
  trimEnd(input, omitting := " `t") { ; trimEnd(input: string, omitting: string): string
    return RTrim(input, omitting)
  }
  trimStart(input, omitting := " `t") { ; trimStart(input: string, omitting: string): string
    return LTrim(input, omitting)
  }
}
class SystemToolkit extends StringToolkit {
  exit() { ; exit(): void
    ExitApp
  }
  off(key, fn) { ; off(key: string, fn: string): void
    Hotkey, % key, % fn, Off
  }
  on(key, fn) { ; on(key, string, fn: string): void
    Hotkey, % key, % fn, On
  }
  reload() { ; reload(): void
    Reload
  }
  sleep(time) { ; sleep(time: number): void
    Sleep, % time
  }
}
class TimerToolkit extends SystemToolkit {
  clearInterval(fn) { ; clearInterval(fn: string): void
    SetTimer, % fn, Delete
  }
  clearTimeout(fn) { ; clearTimeout(fn: string): void
    SetTimer, % fn, Delete
  }
  setInterval(fn, time) { ; setInterval(fn: string, time: number): void
    SetTimer, % fn, % time
  }
  setTimeout(fn, time) { ; setTimeout(fn, string, time: number): void
    SetTimer, % fn, % 0 - time
  }
}
class Toolkit extends TimerToolkit {
  version := "0.0.1"
}
global $ := new Toolkit()
$.move()
