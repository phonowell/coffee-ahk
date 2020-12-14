# include 'module'

globalThis.a = 2

try
  notepad = new Client 'notepad.exe'
  $.on 'ctrl + n', notepad.open

catch e
  throw new Error e

finally
  alert 'Aha!'