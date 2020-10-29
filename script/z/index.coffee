# include ../include/head.ahk
# include ../toolkit/index.ahk

id = WinExist 'A'
isSuspend = false
setInterval ->

  if !isSuspend and !WinActive "ahk_id #{id}"
    $.suspend true
    isSuspend = true
    return

  if isSuspend and WinActive "ahk_id #{id}"
    $.suspend false
    isSuspend = false
    return

, 200

$.on '1', -> alert 1