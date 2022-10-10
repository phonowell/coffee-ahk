# @ts-check

# import .ahk
import './include/a.ahk'

# import .json/.yaml
import b from './include/b.json'

# import .coffee
import alert from './include/alert'
alert b.a

# import module
import m from './include/m'
m.alert m.data.b