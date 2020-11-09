global a := {a: 1}
a := {a: 1, b: 2}
a := {a: 1}
a := {a: 1, b: 2}
a := {a: 1, b: 2, c: {a: 1, b: 2, c: 3}}
global fn := Func("anonymous_1")
anonymous_1() {
  a := {a: 1, b: {a: 1, b: 2}}
  a := 1
}