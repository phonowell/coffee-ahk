$.on("f1", "anonymous_1")
anonymous_1() {
  switch n {
    case 1: {
      return
    }
    case 2: {
      $.clearTimeout("anonymous_2", 1000)
    }
    default: {
      throw Exception("xxx")
    }
  }
}
anonymous_2() {
  $.beep()
}
