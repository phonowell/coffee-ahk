$.on("a", "anonymous_2")
anonymous_1() {
  $.press("b:up")
}
anonymous_2() {
  $.press("b:down")
  setTimeout("anonymous_1", 3000)
}
