$isNear = false

# checkNear(): boolean
checkNear = ->

  unless $isTargeting
    $isNear = false
    return $isNear

  color = $.getColor [1803, 764]

  if color == 0xd23a3a
    $isNear = false
    return $isNear

  $isNear = true
  return $isNear