# coffee-ahk

使用`coffeescript`来写`ahk`。

Just a little toy to code `ahk` in `coffeescript`.

## Usage

- 安装`git`、`nodej`和`ahk`。

  Install. Download and install `git`, `nodejs` & `ahk`

- 克隆项目，在控制台中输入下方内容。

  Clone. Open your shell, and then

```shell
git clone https://github.com/phonowell/coffee-ahk.git
cd coffee-ahk
npm i
```

- 创建脚本，在`./script`中创建一个文件夹，在其中创建`index.ahk`。

  Create. For example, create a file like `index.ahk` at `./script/xxx`

- 码。

  Code.

- 编译，控制台走起。
  
  Build.

```shell
npm run alice build xxx // 'xxx' is your script's dirname
```

- 现在你应该获得了一个`.ahk`文件，跑跑看。
  
  Run. Now you got a `.ahk` file, run it.

## Test

```shell
npm run test
```

## Notice

- `ahk`中没有如下类型：
  - `boolean`: `true`和`false`实际上就是`1`和`0`
  - `array`: `array`实际上就是`object`
  - `buffer`, `error`, `date`...

- `ahk`的函数比较弱：
  - 没有匿名函数
  - 函数不能直接作为参数（但编译器模拟了一下

- 没有`import`和`export`，暂且使用`# include xxx`凑合一下吧

- 几乎所有的`js`内置函数都是没有的

- 慎用类。相关功能基本都不好使……

- 准备实现但还没有搞完的内容：
  - 匿名函数

- `./script/toolkit`是一个内置的工具类，包含了写一个游戏脚本的最基础功能

## Toolkit

### type

```typescript
type Point = [number, number]
```

### array

#### reverse(input: unknown[]): unknown[]

### basic

#### includes(input: string | array, needle: string): boolean

#### length(input: string | array | object): number

#### type(input: unknown): 'array' | 'number' | 'object' | 'string'

### finder

#### findColor(color: number, start: Point = [0, 0], end: Point = [A_ScreenWidth, A_ScreenHeight], variation: number): Point

#### findImage(source: string, start: Point = [0, 0], end: Point = [A_ScreenWidth, A_ScreenHeight]): Point

### getter

#### getColor(point?: Point): number

#### getPosition(): Point

#### getState(key: string): string

### other

#### formatHotkey(key: string): string

#### now(): number

#### random(min: number = 0, max: number = 1): number

### setter

#### click(key?: string): void

#### move(point: Point, speed: number = 0): void

#### setFixed(fixed?: boolean): void

### speaker

#### alert(message: string): string

#### beep(): void

#### info(message: string, point?: Point): string

### string

#### replace(input: string, searchment: string, replacement: string, limit: number = -1): string

#### split(input: string, delimiter: string): string

#### toLowerCase(input: string): string

#### toString(input: unknown): string

#### toUpperCase(input: string): string

#### trim(input: string, omitting: string): string

#### trimEnd(input: string, omitting: string): string

#### trimStart(input: string, omitting: string): string

### system

#### exit(): void

#### off(key: string, fn: Function | string): void

#### on(key, string, fn: Function | string): void

#### open(source: string): void

#### pause(paused?: boolean): void

#### reload(): void

#### sleep(time: number): void

### math

#### abs(n: number): number
  
#### ceil(n: number): number

#### floor(n: number): number

#### round(n: number): number

### timer

#### clearInterval(fn: Function | string): void

#### clearTimeout(fn: Function | string): void

#### setInterval(fn: Function | string, time: number): string

#### setTimeout(fn: Function | string, time: number): string
