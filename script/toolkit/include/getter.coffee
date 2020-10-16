# getColor(point?: Point): number
$.getColor = (point = '') ->
  unless point
    point = $.getPosition()
  `PixelGetColor, __Result__, % point[1], % point[2], RGB`
  return __Result__

# getPosition(): Point
$.getPosition = ->
  `MouseGetPos, __X__, __Y__`
  return [__X__, __Y__]

# getState(key: string): string
$.getState = (key) -> return GetKeyState key