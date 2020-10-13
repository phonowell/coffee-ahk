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

  # press(key...: string): void
  press: (listInput...) ->
    
    # validate
    unless $.length listInput
      throw new Error '$.press: invalid key'

    # format
    listKey = []
    for input in listInput
      _input = $.toLowerCase input
      _input = $.replace _input, ' ', ''
      _list = $.split _input, '+'
      for _it in _list
        listKey.push _it

    # unfold
    listResult = []
    len = $.length listKey
    for key, i in listKey
      # last
      if i == len
        listResult[i] = $.split key, ':'
        continue
      # other
      if $.includes key, ':'
        listResult[i] = $.split key, ':'
        listResult[len * 2 - i] = $.split key, ':'
      else
        listResult[i] = [key, 'down']
        listResult[len * 2 - i] = [key, 'up']

    # alias & join
    for it, i in listResult
      if it[1] == 'win'
        it[1] = 'lwin'
      listResult[i] = $.trim "#{it[1]} #{it[2]}"

    # execute
    output = ''
    for it in listResult
      output = "#{output}{#{it}}"
    `Send, % output`

  # setFixed(fixed?: boolean): void
  setFixed: (isFixed = 'Toggle') ->
    if isFixed != 'Toggle'
      if isFixed
        isFixed = 'On'
      else
        isFixed = 'Off'
    `Winset AlwaysOnTop, % isFixed, A`