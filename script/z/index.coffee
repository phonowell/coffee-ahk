import Client from 'module'

notepad = new Client 'notepad.exe'

$.on 'ctrl + n', notepad.open