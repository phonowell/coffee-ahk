class T {
  a() {
    return 1
  }
  b(n) {
    return n
  }
  c := 0
  d() {
    return this.c
  }
}
global t := new T()