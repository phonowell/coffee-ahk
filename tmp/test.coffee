class Test
  constructor: (name) ->
    @name = name
    do => @name

  greet: ->
    console.log "Hello, #{@name}!"