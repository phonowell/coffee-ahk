# Native AHK code injection

# Backtick syntax (inline raw AHK)
alert = -> `msgbox, % msg`

# Native() function call
alert2 = -> Native 'msgbox, % msg'

# Multi-line native block
showInfo = ->
  `
  gui, add, text,, Hello World
  gui, show
  `

# Native in expression context
getValue = -> Native 'return %myVar%'

# Note: Native code is passed through verbatim
# No transformation or validation is performed
