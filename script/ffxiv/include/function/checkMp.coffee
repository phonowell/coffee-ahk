$mp = 0

# checkMp(): number
checkMp = ->

  # TODO color
  point = $.findColor '#58483e', [181, 36], [328, 36], 10
  x = point[1]

  unless x
    $mp = 100
    return $mp

  $mp = Math.round (x - 181) * 100 / (328 - 181)
  return $mp