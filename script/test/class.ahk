class T {
  a := Func("anonymous_3")
  b := Func("anonymous_2")
  c := 0
  d := Func("anonymous_1")
}
global t := new T()
anonymous_1() {
  return this.c
}
anonymous_2(n) {
  return n
}
anonymous_3() {
  return 1
}