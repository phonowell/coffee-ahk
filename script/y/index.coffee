$.on 'f1', -> switch n
  when 1 then return
  when 2
    $.clearTimeout ->
      $.beep()
    , 1e3
  else throw new Error 'xxx'