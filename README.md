# coffee-ahk

使用`coffeescript`来写`ahk`。

Just a little toy to code `ahk` in `coffeescript`.

## Usage

- 安装`git`、`nodej`和`ahk`。

  Install. Download and install `git`, `nodejs` & `ahk`

- 克隆项目。在控制台中输入下方内容。

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

- 现在你应该获得了一个`.ahk`文件，跑跑看吧。
  
  Run. Now you got a `.ahk` file, run it.

## Test

```shell
npm run test
```

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

#### click(input?: string): void

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

#### reload(): void

#### sleep(time: number): void

### timer

#### clearInterval(fn: Function | string): void

#### clearTimeout(fn: Function | string): void

#### setInterval(fn: Function | string, time: number): void

#### setTimeout(fn: Function | string, time: number): void

### math

#### abs(n: number): number
  
#### ceil(n: number): number

#### floor(n: number): number

#### round(n: number): number
