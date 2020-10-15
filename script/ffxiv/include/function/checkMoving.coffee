$isMoving = false

# checkMoving(): boolean
checkMoving = ->

  dis = $.getState '2-joy-x'
  if dis < 40 or dis > 60
    isMoving = true
    return $isMoving

  dis = $.getState '2-joy-y'
  if dis < 40 or dis > 60
    $isMoving = true
    return $isMoving

  $isMoving = false
  return $isMoving