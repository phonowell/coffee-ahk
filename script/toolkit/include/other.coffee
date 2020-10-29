# formatHotkey(key: string): string
$.formatHotkey = (key) ->

  # format
  _listKey = []
  _key = $.toLowerCase key
  _key = $.replace _key, ' ', ''
  _key = $.replace _key, '-', ''
  _list = $.split _key, '+'
  for it in _list
    _listKey.Push it

  # unfold
  _isAlt = false
  _isCtrl = false
  _isShift = false
  _isWin = false
  _listResult = []
  for key in _listKey
    if key == 'alt'
      _isAlt = true
      continue
    if key == 'ctrl'
      _isCtrl = true
      continue
    if key == 'shift'
      _isShift = true
      continue
    if key == 'win'
      _isWin = true
      continue
    _listResult.Push key

  _prefix = ''
  if _isAlt then _prefix = "#{_prefix}!"
  if _isCtrl then _prefix = "#{_prefix}^"
  if _isShift then _prefix = "#{_prefix}+"
  if _isWin then _prefix = "#{_prefix}#"

  _result = ''
  for it in _listResult
    _result = "#{_result} & #{it}"
  return $.replace "#{_prefix}#{$.trim _result, ' &'}", ':', ' '

# now(): number
$.now = -> return A_TickCount

# random(min: number = 0, max: number = 1): number
$.random = (min = 0, max = 1) ->
  `Random, __Result__, min, max`
  return __Result__