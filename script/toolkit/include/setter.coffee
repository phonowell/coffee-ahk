# include other

class SetterToolkit extends OtherToolkit

  # click(input?: string): void
  click: (input = '') ->
    unless input
      `Click`
      `return`
    `Click, % StrReplace input, ":", " "`

  # move(point: Point, speed: number = 0): void
  move: (point = '', speed = 0) ->
    unless point
      throw new Error '$.move: invalid point'
    `MouseMove, point[1], point[2], speed`