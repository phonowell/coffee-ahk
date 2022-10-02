class Promise

  constructor: (executor) ->

    @status = 'pending'
    @value = ''
    @reason = ''
    @listCallbackResolved = []
    @listCallbackRejected = []

    resolve = (value) =>
      unless @status == 'pending' then return
      @status = 'fulfilled'
      @value = value
      for callback in @listCallbackResolved
        callback value

    reject = (reason) =>
      unless @status == 'pending' then return
      @status = 'rejected'
      @reason = reason
      for callback in @listCallbackRejected
        callback reason

    executor resolve, reject

  then: (onFulfilled, onRejected) -> return new Promise (resolve, reject) ->

    resolveFn = (value) ->
      try
        x = onFulfilled value
        if x.__class == 'Promise'
          x.then resolve, reject
        else resolve x
      catch error
        reject error

    rejectFn = (reason) ->
      try
        x = onRejected reason
        if x.__class == 'Promise'
          x.then resolve, reject
        else resolve x
      catch error
        reject error

    switch @status
      when 'pending'
        @listCallbackResolved.Push resolveFn
        @listCallbackRejected.Push rejectFn
      when 'fulfilled'
        resolveFn @value
      when 'rejected'
        rejectFn @reason

  catch: (rejectFn) -> return @then '', rejectFn

do ->

  new Promise (resolve) ->
    fn = -> resolve 'hello'
    Native 'SetTimer, % fn, -1000'
  .then (value) -> Native 'MsgBox, % value'