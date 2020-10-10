# include ../include/head
# include ../toolkit/index

fn = -> $.info $.getColor()
$.setInterval 'fn', 1e3