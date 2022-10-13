# @ts-check

# import '../../../gis-static/lib/head.ahk'
# import './include/m'

import $admin from 'shell-ahk/dist/module/admin'
import $alert from 'shell-ahk/dist/module/alert'
import $on from 'shell-ahk/dist/module/on'
import $exit from 'shell-ahk/dist/module/exit'

$admin()
$on 'f1', -> $alert 1
$on 'f2', -> $exit()