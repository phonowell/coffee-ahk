# include basic

class FinderToolkit extends basicToolkit
  
  # findColor(
  #   color: number,
  #   start: Point = [0, 0],
  #   end: Point = [A_ScreenWidth, A_ScreenHeight],
  #   variation = 0
  # ): Point
  findColor: (
    color = ''
    start = '', end = ''
    variation = 0
  ) ->
    unless color
      throw new Error '$.findColor: invalid color'
    unless start
      start = [0, 0]
    unless end
      end = [A_ScreenWidth, A_ScreenHeight]
    `PixelSearch __X__, __Y__, start[1], start[2], end[1], end[2], color, variation, Fast RGB`
    return [__X__, __Y__]
  
  