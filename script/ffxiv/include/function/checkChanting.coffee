$isChanting = false

# checkChanting(): boolean
checkChanting = ->

  if $isMoving
    $isChanting = false
    return $isChanting

  color = $.getColor [1130, 865]
  $isChanting = color == 0x2b1b13
  return $isChanting