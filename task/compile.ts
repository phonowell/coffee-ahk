import $ from 'fire-keeper'
import transpile from '../dist'

// function

async function main_(): Promise<void> {

  const target = pickTarget()
  if (!target)
    throw new Error('found no target')

  await $.remove_(`./script/${target}/*.ahk`)

  await transpile(`./script/${target}/index.coffee`, {
    save: true,
  })
}

function pickTarget(): string {
  const argv = $.argv()
  return argv._[1] || argv.target || ''
}

// export
export default main_
