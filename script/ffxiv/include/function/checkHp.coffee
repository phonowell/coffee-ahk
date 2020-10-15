$hp = 0

# checkHp(): number
checkHp = ->

  # TODO color
  point = $.findColor 0x58483e, [21, 36], [168, 36], 10
  x = point[1]

  unless x
    $hp = 100
    return $hp

  $hp = Math.round (x - 21) * 100 / (168 - 21)
  return $hp