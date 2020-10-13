# include ../include/head
# include ../toolkit/index
openNotepad = -> $.open 'notepad.exe'
$.on 'win + n', openNotepad