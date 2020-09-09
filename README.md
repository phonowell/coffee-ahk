# coffee-basic

## 概述

### 这是啥？

一个将`coffeescript`转换为`ahk`的项目，目的是让使用者能够使用`coffeescript`来书写`ahk`。

### 有必要么？

`ahk`的语法是啥样的，有实际用过的人应该懂的都懂。觉得没有必要的人大可以坚持写原生`ahk`，毕竟**也不是不能用**。

### 为啥是`coffeescript`？

主要因为如下原因：

- 历史原因，`coffeescript`是我之前的主力语言，我对这门语言非常熟悉

- `coffeescript`语法简洁优雅，强制缩进的特性很适合入门者

- `coffeescript`作为脚本语言，本身与`ahk`有一定相似性，易于搞转换

综上，选择使用从该语言转换至`ahk`。

## 内置函数

### alert(message: string): string

没啥好说的。

```coffeescript
alert 'hello'
```

### clearInterval(funcName: string): void

类似于`js`中的`clearInterval()`，但只能使用函数名作为参数。

```coffeescript
clearInterval fn
```

### clearTimeout(funcName: string): void

类似于`js`中的`clearTimeout()`，但只能使用函数名作为参数。

```coffeescript
clearTimeout fn
```

### prompt(message: string, defaultValue?: string): string

没啥好说的。

```coffeescript
msg = prompt 'input your message', 'hello?'
```

### setInterval(funcName: string): void

类似于`js`中的`setInterval()`，但只能使用函数名作为参数。

```coffeescript
setInterval fn
```

### setTimeout(funcName: string): void

类似于`js`中的`setTimeout()`，但只能使用函数名作为参数。

```coffeescript
setTimeout fn
```

### Math

没啥好说的。

```coffeescript
a = Math.abs -1 # Math.abs(n: number): number
b = Math.ceil 1.1 # Math.ceil(n: number): number
c = Math.floor 1.2 # Math.floor(n: number): number
d = Math.round 1.3 # Math.round(n: number): number
```

### $.beep(): void

令系统发出“哔”的一声。

```coffeescript
$.beep()
```

### $.click(position?: string): void

在鼠标的当前位置点击一次。

```coffeescript
$.click() # 点击左键
$.click 'right' # 点击右键
$.click 'right:down' # 按下右键
```

### $.exit(): void

退出脚本。

```coffeescript
$.exit()
```

### $.findColor(color: string, x?: number, y?: number, x1?: number, y1?: number, variation?: number): [number, number]

找色。

```coffeescript
[x, y] = $.findColor '#fff' # 在整个屏幕区域内找色
[x1, y1] = $.findColor '#000', 0, 0, 100, 100 # 指定区域内找色
```

### $.findImage(path: string, x?: number, y?: number, x1?: number, y1?: number, variation?: number): [number, number]

找图。

```coffeescript
[x, y] = $.findImage 'apple.png' # 查找和脚本同目录下的apple.png
```

### $.getColor(x?: number, y?: number): string

获取指定位置的颜色。

```coffeescript
color = $.getColor() # 获取鼠标当前位置的颜色，返回的颜色总为0xFFFFFF的rgb格式
color = $.getColor 100, 100 # 获取指定位置的颜色
```

### $.getPosition(): [number, number]

获取鼠标位置。

```coffeescript
[x, y] = $.getPosition()
```

### $.getState(key: string): string

获取按键状态。

```coffeescript
state = $.getState 'joy-1'
```

### $.info(message?: string): string

调用系统通知显示信息。

```coffeescript
$.info 'hello'
```

### $.isPressing(key: string): boolean

判断按键是否被按下。

```coffeescript
isPressing = $.isPressing 'a'
```

### $.move(x: number, y: number, speed: number): [number, number, number]

移动鼠标到指定位置。

```coffeescript
$.move 100, 100
```

### $.open(target: string): string

打开文档。

```coffeescript
$.open 'Notepad'
```

### $.press(): void

按下按键。

```coffeescript
$.press 'a'
$.press 'a:down'
$.press 'ctrl + shift + a'
```

### $.reload(): void

重载脚本。

```coffeescript
$.reload()
```

### $.setFixed(isFixed?: boolean): void

置顶/取消置顶当前窗口。

```coffeescript
$.setFixed true # 置顶
$.setFixed false # 取消置顶
$.setFixed() # 切换
```

### $.sleep(time: number): void

挂起当前线程。

```coffeescript
$.sleep 1e3
```

### $.tip(message?: string, x?: number, y?: number): void

使用工具条显示信息。

```coffeescript
$.tip 'hello' # 显示信息
$.tip() # 隐藏信息
$.tip 'aloha', 100, 100 # 在指定位置显示信息
```

### $.trim(string: string): string

没啥好说的。

```coffeescript
$.trim ' hello '
```

### $.trimEnd(string: string): string

没啥好说的。

```coffeescript
$.trimEnd ' hello '
```

### $.trimStart(string: string): string

没啥好说的。

```coffeescript
$.trimStart ' hello '
```

### $.write(filename: string, content: string): void

写入文件。

```coffeescript
$.write 'test.txt', 'hello world!'
```
