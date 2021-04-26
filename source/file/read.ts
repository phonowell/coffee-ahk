import include_ from './include'
import read_ from 'fire-keeper/read_'

// function

const main = async (
  source: string,
) => {

  let src = source

  const extname = '.coffee'
  if (!src.endsWith(extname)) src += extname

  const content = await include_(
    await read_<string>(src),
    src
  )

  if (!content)
    throw new Error(`invalid source '${src}'`)

  return content
}

// export
export default main