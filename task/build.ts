import $ from 'fire-keeper'
import compile_ from '../source'

// function

async function main_(): Promise<void> {

  type Argv = {
    target: string
  }

  const { target }: Argv = $.argv() as Argv
  if(!target)
    throw new Error('found no target')

  await $.remove_(`./script/${target}/*.ahk`)

  await compile_(`./script/${target}/index.coffee`, {
    save: true,
    verbose: true
  })
}

// export
export default main_