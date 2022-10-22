import alert from './include/alert'

act = (callback, args...) -> callback args...

do ->
  act alert, 'hello world'