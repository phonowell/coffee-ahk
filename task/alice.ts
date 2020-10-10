import $ from 'fire-keeper'

// function

class M {

  list: string[]

  constructor() {
    this.list = []
  }

  async ask_(): Promise<void> {

    const task: string = await $.prompt_({
      id: 'default-task',
      list: this.list,
      message: 'input a task name',
      type: 'auto'
    })
    if (!task) return
    await this.run_(task)
  }

  async load_(): Promise<void> {

    const listSource: string[] = await $.source_('./task/*.ts')
    const listTask: string[] = []
    for (const source of listSource) {
      const basename: string = $.getBasename(source)
      if (basename === 'alice') continue
      listTask.push(basename)
    }
    this.list = listTask
  }

  async main_(): Promise<void> {

    const task: string = $.argv()._[0]

    await this.load_()

    if (!task) {
      await this.ask_()
      return
    }

    if (this.list.includes(task)) {
      await this.run_(task)
      return
    }

    $.i(`found no task named as '${task}'`)
  }

  async run_(
    task: string
  ): Promise<void> {

    const [source]: string[] = await $.source_(`./task/${task}.ts`)
    const fn_: Function = (await import(source)).default
    await fn_()
  }
}

// execute
new M().main_()