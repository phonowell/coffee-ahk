import {
  argv,
  echo,
  getBasename,
  getDirname,
  glob,
  prompt,
  root,
  run,
} from 'fire-keeper'
import { trim } from 'radash'

type AsyncFn = <T>() => Promise<T>

/**
 * 执行指定的任务
 * @param taskName 任务名称
 */
const executeTask = async (taskName: string) => {
  const formattedTaskName = run(() => {
    if (!taskName.includes('@')) return taskName
    const [a, b] = taskName.split('@')
    return [b, a].join('/')
  })

  const [taskPath] = await glob([
    `./task/${formattedTaskName}.js`,
    `./task/${formattedTaskName}.ts`,
    `./task/${formattedTaskName}/index.js`,
    `./task/${formattedTaskName}/index.ts`,
  ])

  if (!taskPath) {
    echo(`Task not found: '${formattedTaskName}'`)
    return
  }

  const taskFn = ((await import(taskPath)) as { default: AsyncFn | undefined })
    .default
  if (!taskFn) {
    echo(`No valid task function found: '${formattedTaskName}'`)
    return
  }

  await taskFn()
}

const findMatchingTask = (inputTask: string, tasks: string[]): string => {
  // 精确匹配
  if (tasks.includes(inputTask)) return inputTask

  // 模糊匹配
  const matchingTasks = tasks.filter((task) => {
    const [taskName] = task.split('@')
    return taskName === inputTask
  })

  if (matchingTasks.length === 1) return matchingTasks[0]
  if (matchingTasks.length > 1) {
    echo(`Multiple tasks found for '${inputTask}': ${matchingTasks.join(', ')}`)
    return inputTask
  }

  return inputTask
}

/**
 * 加载可用任务列表
 * @returns 任务名称数组
 */
const loadTasks = async (): Promise<string[]> => {
  const sources = await glob([
    './task/**/*.js',
    './task/**/*.ts',
    '!./task/utils/**/*',
    '!*.d.ts',
  ])

  return sources
    .map((source) =>
      [getBasename(source), getDirname(source).replace(`${root()}/task`, '')]
        .map((it) => trim(it, ' /'))
        .filter(Boolean)
        .join('@'),
    )
    .filter((source) => !['index', 'alice'].includes(source))
}

/**
 * 提示用户从列表中选择一个任务
 * @param tasks 可用任务列表
 * @returns 选择的任务名称
 */
const promptTask = async (tasks: string[]): Promise<string> => {
  const answer = await prompt({
    id: 'default-task',
    list: tasks,
    message: 'Select a task',
    type: 'auto',
  })
  if (!answer) return ''
  if (!tasks.includes(answer)) return promptTask(tasks)
  return answer
}

/**
 * 主函数：处理命令行参数或提示用户选择一个任务，然后执行该任务
 */
const main = async () => {
  const args = (await argv())._[0]
  const tasks = await loadTasks()

  const task = args
    ? findMatchingTask(args.toString(), tasks)
    : await promptTask(tasks)

  if (!task) return
  await executeTask(task)
}

// 执行主函数
main()
