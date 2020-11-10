# include ../include/head.ahk
# include ../toolkit/index.ahk

for i in [1, 2, 3, 4, 5]
  fn = (n) -> $.info(n)
  setTimeout(fn.Bind(i), i * 1e3)
