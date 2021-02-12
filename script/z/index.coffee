class AX

  value: 0

  constructor: -> @value = 1

  display: ->

    value = @value
    `msgbox, % value`

class BX extends AX

  constructor: -> super()

# a = new AX()
# a.display()

b = new BX()
b.display()