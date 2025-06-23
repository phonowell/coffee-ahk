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