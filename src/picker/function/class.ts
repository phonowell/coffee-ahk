import { appendBind } from './class/append-bind.js'
import { formatSuper } from './class/format-super.js'
import { prependThis } from './class/prepend-this.js'
import { renameConstructor } from './class/rename-constructor.js'

import type { Context } from '../../types'

const main = (ctx: Context) => {
  prependThis(ctx)
  appendBind(ctx)
  renameConstructor(ctx)
  formatSuper(ctx)
}

export default main
