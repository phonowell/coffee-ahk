import $ from 'fire-keeper'
import _ from 'lodash'

// interface

interface Choice {
  title: string
  value: string
}

// function

class M {

  async ask_(source: string, target: string): Promise<string> {

    const isExisted: [boolean, boolean] = [
      await $.isExisted_(source),
      await $.isExisted_(target)
    ]

    const mtime: [number, number] = [0, 0]
    if (isExisted[0]) {
      const stat = await $.stat_(source)
      mtime[0] = stat
        ? stat.mtimeMs
        : 0
    }
    if (isExisted[1]) {
      const stat = await $.stat_(target)
      mtime[1] = stat
        ? stat.mtimeMs
        : 0
    }

    const choice: Choice[] = []

    if (isExisted[0])
      choice.push({
        title: [
          'overwrite, export',
          mtime[0] > mtime[1] ? '(newer)' : ''
        ].join(' '),
        value: 'export'
      })

    if (isExisted[1])
      choice.push({
        title: [
          'overwrite, import',
          mtime[1] > mtime[0] ? '(newer)' : ''
        ].join(' '),
        value: 'import'
      })

    if (!choice.length) {
      $.info('skip')
      return 'skip'
    }

    choice.push({
      title: 'skip',
      value: 'skip'
    })

    return await $.prompt_({
      list: choice,
      message: 'and you decide to...',
      type: 'select'
    })
  }

  async execute_(): Promise<void> {

    const data: string[] = await this.load_()

    // diff
    for (const line of data) {

      const _list: string[] = line.split('@')
      const [path, extra]: [string, string] = [_list[0], _list[1] || '']

      const _list2: string[] = extra.split('/')
      const [namespace, version]: [string, string] = [
        _list2[0] || 'default',
        _list2[1] || 'latest'
      ]

      const source: string = `./${path}`
      let target: string = `../midway/${path}`
      const { basename, dirname, extname }: {
        basename: string
        dirname: string
        extname: string
      } = $.getName(target)
      target = `${dirname}/${basename}-${namespace}-${version}${extname}`

      if (await $.isSame_([source, target])) continue

      $.info(`'${source}' is different from '${target}'`)

      const value: string = await this.ask_(source, target)
      if (!value) break

      await this.overwrite_(value, source, target)
    }
  }

  async load_(): Promise<string[]> {

    $.info().pause()
    const listSource: string[] = await $.source_('./data/sync/**/*.yaml')
    const listData: string[][] = []
    for (const source of listSource)
      listData.push(await $.read_(source) as string[])
    $.info().resume()

    let result: string[] = []

    for (const data of listData)
      result = [
        ...result,
        ...data
      ]

    return _.uniq(result)
  }

  async overwrite_(value: string, source: string, target: string): Promise<void> {

    if (value === 'export') {
      const { dirname, filename }: {
        dirname: string
        filename: string
      } = $.getName(target)
      await $.copy_(source, dirname, filename)
    }

    if (value === 'import') {
      const { dirname, filename }: {
        dirname: string
        filename: string
      } = $.getName(source)
      await $.copy_(target, dirname, filename)
    }
  }
}

// export
export default async (): Promise<void> => await (new M()).execute_()