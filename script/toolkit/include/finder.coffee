# findColor(
#   color: number,
#   start: Point = [0, 0],
#   end: Point = [A_ScreenWidth, A_ScreenHeight],
#   variation = 0
# ): Point
$.findColor = (
  color
  start = '', end = ''
  variation = 0
) ->
  unless start
    start = [0, 0]
  unless end
    end = [A_ScreenWidth, A_ScreenHeight]
  `PixelSearch __X__, __Y__, start[1], start[2], end[1], end[2], color, variation, Fast RGB`
  return [__X__, __Y__]

# findImage(
#   source: string,
#   start: Point = [0, 0],
#   end: Point = [A_ScreenWidth, A_ScreenHeight],
# ): Point
$.findImage = (
  source
  start = '', end = ''
) ->
  unless start
    start = [0, 0]
  unless end
    end = [A_ScreenWidth, A_ScreenHeight]
  `ImageSearch __x__, __Y__, start[1], start[2], end[1], end[2], % A_ScriptDir . "\\\" . source`
  return [__X__, __Y__]