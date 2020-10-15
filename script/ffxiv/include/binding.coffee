# reload

$.on 'f5', ->
  resetKey()
  resetTs()
  $.beep()
  setLevel()

# hard reload
$.on 'ctrl + f5', ->
  resetKey()
  $.beep()
  $.reload()

# exit
$.on 'alt + f4', ->
  resetKey()
  $.beep()
  $.exit()

# ---

$.on '2-joy-12', ->
  unless checkTrigger() then return
  use '冲刺'