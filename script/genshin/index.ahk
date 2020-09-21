; function
actionE() {
  $.press("e")
}
autoJump() {
  $.clearTimeout("jump")
  jump()
  $.setTimeout("jump", 200)
}
changeCharacter1() {
  $.clearTimeout("actionE")
  $.press("1")
  $.setTimeout("actionE", 200)
}
changeCharacter2() {
  $.clearTimeout("actionE")
  $.press("2")
  $.setTimeout("actionE", 200)
}
changeCharacter3() {
  $.clearTimeout("actionE")
  $.press("3")
  $.setTimeout("actionE", 200)
}
changeCharacter4() {
  $.clearTimeout("actionE")
  $.press("4")
  $.setTimeout("actionE", 200)
}
changeCharacter5() {
  $.clearTimeout("actionE")
  $.press("5")
  $.setTimeout("actionE", 200)
}
jump() {
  $.press("space")
}
$.on("1", "changeCharacter1") ; binding
$.on("2", "changeCharacter2")
$.on("3", "changeCharacter3")
$.on("4", "changeCharacter4")
$.on("5", "changeCharacter5")
$.on("space", "autoJump")
