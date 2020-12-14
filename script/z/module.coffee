class Client

  name: ''

  constructor: (name) -> @name = name

  open: -> $.open @name

  close: -> `Process, Close, % this.name`