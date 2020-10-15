setTimeout("anonymous_4", 4000)
anonymous_1() {
  1
}
anonymous_2() {
  setTimeout("anonymous_1", 1000)
}
anonymous_3() {
  setTimeout("anonymous_2", 2000)
}
anonymous_4() {
  setTimeout("anonymous_3", 3000)
}