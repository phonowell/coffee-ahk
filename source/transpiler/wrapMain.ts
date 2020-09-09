import { regFn } from './fn'

// interface

import { Block } from '../type'

// function

function main(
  listFn: Block[],
  listMain: string[]
): void {

  if (!(
    listMain
      .join('\n')
      .trim()
  )) return

  regFn(listFn, '$default', [], listMain)
}

// export
export default main