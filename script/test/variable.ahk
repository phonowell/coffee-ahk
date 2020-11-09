global a := 1
a := 2
global fn := Func("anonymous_2")
global c := 1
c := 2
fn := Func("anonymous_1")
anonymous_1() {
  c := 3
}
anonymous_2() {
  b := 1
  b := 2
}