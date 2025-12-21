class KeyBindingShell
  constructor: ->
    @mapBound = {}
    @mapCallback = {}
    @mapPrevented = {}

  prepare: (key) ->
    if @mapCallback[key] then return
    @mapBound[key] = => @fire key
    @mapCallback[key] = []
    @mapPrevented[key] = false
    return

  fire: (key) ->
    console.log "Firing: " . key
