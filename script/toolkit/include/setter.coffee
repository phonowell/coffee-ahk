# click(key?: string): void
$.click = (key = 'left') ->
  key = $.replace key, '-', ''
  key = $.replace key, ':', ' '
  `Click, % key`

# move(point: Point, speed: number = 0): void
$.move = (point = '', speed = 0) ->
  unless point
    throw new Error '$.move: invalid point'
  `MouseMove, point[1], point[2], speed`

# press(key...: string): void
$.press = (listInput...) ->

  # validate
  unless $.length listInput
    throw new Error '$.press: invalid key'

  # format
  _listKey = []
  for input in listInput
    _input = $.toLowerCase input
    _input = $.replace _input, ' ', ''
    _input = $.replace _input, '-', ''
    _list = $.split _input, '+'
    for it in _list
      _listKey.Push it

  # unfold
  _listResult = []
  _len = $.length _listKey
  for key, i in _listKey
    # last
    if i == _len
      _listResult[i] = $.split key, ':'
      continue
    # other
    if $.includes key, ':'
      _listResult[i] = $.split key, ':'
      _listResult[_len * 2 - i] = $.split key, ':'
    else
      _listResult[i] = [key, 'down']
      _listResult[_len * 2 - i] = [key, 'up']

  # alias & join
  for it, i in _listResult
    if it[1] == 'win'
      it[1] = 'lwin'
    _listResult[i] = $.trim "#{it[1]} #{it[2]}"

  # execute
  _output = ''
  for it in _listResult
    _output = "#{_output}{#{it}}"
  `Send, % _output`

# setFixed(fixed?: boolean): void
$.setFixed = (isFixed = 'Toggle') ->
  if isFixed != 'Toggle'
    if isFixed then isFixed = 'On'
    else isFixed = 'Off'
  `Winset AlwaysOnTop, % isFixed, A`