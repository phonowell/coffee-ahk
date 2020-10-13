# include getter

class OtherToolkit extends GetterToolkit

  # formatHotkey(key: string): string
  formatHotkey: (key = '') ->

    # validate
    unless key
      throw new Error '$.formatHotkey: invalid key'

    # format
    listKey = []
    _key = $.toLowerCase key
    _key = $.replace _key, ' ', ''
    _list = $.split _key, '+'
    for _it in _list
      listKey.push _it

    # unfold
    isAlt = false
    isCtrl = false
    isShift = false
    isWin = false
    listResult = []
    for key in listKey
      if key == 'alt'
        isAlt = true
        continue
      if key == 'ctrl'
        isCtrl = true
        continue
      if key == 'shift'
        isShift = true
        continue
      if key == 'win'
        isWin = true
        continue
      listResult.push key

    prefix = ''
    if isAlt then prefix = "#{prefix}!"
    if isCtrl then prefix = "#{prefix}^"
    if isShift then prefix = "#{prefix}+"
    if isWin then prefix = "#{prefix}#"

    result = ''
    for it in listResult
      result = "#{result} & #{it}"
    return $.replace "#{prefix}#{$.trim result, ' &'}", ':', ' '

  # now(): number
  now: -> return A_TickCount
  
  # random(min: number = 0, max: number = 1): number
  random: (min = 0, max = 1) ->
    `Random, __Result__, min, max`
    return __Result__