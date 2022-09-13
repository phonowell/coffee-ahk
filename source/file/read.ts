import include from './include'
import read from 'fire-keeper/dist/read'

// function

const main = async (source: string): Promise<string> => {
  let src = source

  const extname = '.coffee'
  if (!src.endsWith(extname)) src += extname

  const raw = await read<string>(src)
  if (!raw) throw new Error(`invalid source '${src}'`)
  const content = await include(raw, src)

  if (!content) throw new Error(`invalid source '${src}'`)

  return content
}

// export
export default main
