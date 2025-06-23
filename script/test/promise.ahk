global Promise := anonymous() {
  class Promise {
    __New(executor) {
      this.state := "pending"
      this.value := ""
      this.handlers := []

      if (executor) {
        try {
          resolve := ObjBindMethod(this, "resolve")
          reject := ObjBindMethod(this, "reject")
          executor.Call(resolve, reject)
        } catch e {
          this.reject(e)
        }
      }
    }

    resolve(value) {
      if (this.state = "pending") {
        this.state := "fulfilled"
        this.value := value
        this.executeHandlers()
      }
    }

    reject(reason) {
      if (this.state = "pending") {
        this.state := "rejected"
        this.value := reason
        this.executeHandlers()
      }
    }

    then(onFulfilled := "", onRejected := "") {
      promise := new Promise()

      handler := {
        onFulfilled: onFulfilled,
        onRejected: onRejected,
        promise: promise
      }

      this.handlers.Push(handler)

      if (this.state != "pending") {
        this.executeHandlers()
      }

      return promise
    }

    catch(onRejected) {
      return this.then("", onRejected)
    }

    finally(onFinally) {
      return this.then(
      Func("__promise_finally_fulfilled").Bind(onFinally),
      Func("__promise_finally_rejected").Bind(onFinally)
      )
    }

    executeHandlers() {
      for index, handler in this.handlers {
        this.executeHandler(handler)
      }
      this.handlers := []
    }

    executeHandler(handler) {
      try {
        if (this.state = "fulfilled") {
          if (handler.onFulfilled && IsFunc(handler.onFulfilled)) {
            result := handler.onFulfilled.Call(this.value)
            handler.promise.resolve(result)
          } else {
            handler.promise.resolve(this.value)
          }
        } else if (this.state = "rejected") {
          if (handler.onRejected && IsFunc(handler.onRejected)) {
            result := handler.onRejected.Call(this.value)
            handler.promise.resolve(result)
          } else {
            handler.promise.reject(this.value)
          }
        }
      } catch e {
        handler.promise.reject(e)
      }
    }

    static resolve(value) {
      promise := new Promise()
      promise.resolve(value)
      return promise
    }

    static reject(reason) {
      promise := new Promise()
      promise.reject(reason)
      return promise
    }

    static all(promises) {
      if (!promises || !promises.Length()) {
        return Promise.resolve([])
      }

      return new Promise(Func("__promise_all_executor").Bind(promises))
    }

    static race(promises) {
      if (!promises || !promises.Length()) {
        return new Promise()
      }

      return new Promise(Func("__promise_race_executor").Bind(promises))
    }

    static allSettled(promises) {
      if (!promises || !promises.Length()) {
        return Promise.resolve([])
      }

      return new Promise(Func("__promise_allSettled_executor").Bind(promises))
    }
  }

  __promise_all_executor(promises, resolve, reject) {
    results := []
    completed := 0
    total := promises.Length()

    for index, promise in promises {
      allFulfilled := Func("__promise_all_fulfilled")
      promise.then(
      allFulfilled.Bind(results, index, resolve, reject, completed, total),
      reject
      )
    }
  }

  __promise_all_fulfilled(results, index, resolve, reject, ByRef completed, total, value) {
    results[index] := value
    completed++
    if (completed = total) {
      resolve.Call(results)
    }
  }

  __promise_race_executor(promises, resolve, reject) {
    for index, promise in promises {
      promise.then(resolve, reject)
    }
  }

  __promise_allSettled_executor(promises, resolve, reject) {
    results := []
    completed := 0
    total := promises.Length()

    for index, promise in promises {
      fulfilledFn := Func("__promise_allSettled_fulfilled")
      rejectedFn := Func("__promise_allSettled_rejected")
      promise.then(
      fulfilledFn.Bind(results, index, resolve, completed, total),
      rejectedFn.Bind(results, index, resolve, completed, total)
      )
    }
  }

  __promise_allSettled_fulfilled(results, index, resolve, ByRef completed, total, value) {
    results[index] := {status: "fulfilled", value: value}
    completed++
    if (completed = total) {
      resolve.Call(results)
    }
  }

  __promise_allSettled_rejected(results, index, resolve, ByRef completed, total, reason) {
    results[index] := {status: "rejected", reason: reason}
    completed++
    if (completed = total) {
      resolve.Call(results)
    }
  }

  __promise_finally_fulfilled(onFinally, value) {
    if (onFinally && IsFunc(onFinally)) {
      onFinally.Call()
    }
    return value
  }

  __promise_finally_rejected(onFinally, reason) {
    if (onFinally && IsFunc(onFinally)) {
      onFinally.Call()
    }
    throw reason
  }

  await(promise) {
    if (!promise || !IsObject(promise)) {
      return promise
    }

    if (promise.state = "fulfilled") {
      return promise.value
    }

    if (promise.state = "rejected") {
      throw promise.value
    }

    while (promise.state = "pending") {
      continue
    }

    if (promise.state = "fulfilled") {
      return promise.value
    } else {
      throw promise.value
    }
  }
}
Promise()

global asyncFn := Func("ahk_8").Bind(somePromise)
global asyncFnWithParams := Func("ahk_7").Bind(fetch)
global promise := new Promise(Func("ahk_6").Bind(condition, value, err))
global resolved := Promise.resolve.Call(42)
global rejected := Promise.reject.Call(Exception("Failed"))
global all := Promise.all.Call([promise1, promise2, promise3])
global race := Promise.race.Call([promise1, promise2])
global allSettled := Promise.allSettled.Call([promise1, promise2])
promise.then.Call(Func("ahk_5").Bind(console)).catch.Call(Func("ahk_4").Bind(console)).finally.Call(Func("ahk_3").Bind(console))
  global fn := Func("ahk_2").Bind(asyncOperation, err, cleanup)
global multipleAwaits := Func("ahk_1").Bind(promiseA, promiseB, promiseC)
ahk_1(promiseA, promiseB, promiseC) {
  a := await promiseA.Call()
  b := await promiseB.Call(a)
  c := await promiseC.Call(b)
  return [a, b, c]
}
ahk_2(asyncOperation, err, cleanup) {
  try {
    result := await asyncOperation.Call()
    return result
  } catch err {
    throw err
  } finally {
    cleanup.Call()
  }
}
ahk_3(console) {
  return console.log.Call("Done")
}
ahk_4(console, err) {
  return console.error.Call(err)
}
ahk_5(console, result) {
  console.log.Call(result)
  return result * 2
}
ahk_6(condition, value, err, resolve, reject) {
  if (condition) {
    resolve.Call(value)
  } else {
    reject.Call(err)
  }
}
ahk_7(fetch, a, b) {
  result := await fetch.Call(a)
  return result + b
}
ahk_8(somePromise) {
  return await somePromise.Call()
}