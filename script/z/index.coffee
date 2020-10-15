# include ../include/head.ahk
# include ../toolkit/index.ahk

fn = (n, callback) -> callback n
fn 2, (result) -> $.alert result