# include ../include/head.ahk
# include ../toolkit/index.ahk
openNotepad = -> $.open 'notepad.exe'
$.on 'win + n', openNotepad