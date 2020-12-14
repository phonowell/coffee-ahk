if (a > 1) {
  1
}
if (a > 1) {
  1
} else {
  2
}
if !(a > 1) {
  1
} else {
  2
}
if !(a > 1) {
  1
} else if (a > 2) {
  2
} else {
  3
}
if (a > 1) {
  if (b > 1) {
    1
  } else {
    2
  }
} else {
  3
}
global fn := Func("ahk_1")
if !(fn.Call(1)) {
  1
} else {
  2
}
ahk_1() {
  if !(1) {
    1
  } else {
    2
  }
}