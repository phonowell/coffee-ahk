# coffee-ahk

使用`coffeescript`来写`ahk`。

Just a little toy to code `ahk` in `coffeescript`.

## Usage

- 安装`git`、`nodejs`和`ahk`。

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

- `.coffee`文件编码使用`utf8`。`.ahk`文件编码使用`uft8 with BOM`；
- `=>`不可用。实际上由于`ahk`和`js`在`this`上的差异，这个关键字很难实现；
- `ahk`中字符和数字的区别非常模糊，`'0'`在`ahk`中返回为`false`；
- `ahk`并不支持匿名函数，解释器所提供的模拟方案尚无法传入上下文；
- 函数必须在最外层声明；
- 可以使用`true`、`false`、`on`和`off`，但要注意不要试图使用类型判断。在`ahk`中不存在`boolean`类型；
- 尚不支持`?`；
- 尚不支持`a = 1 unless a >= 1`这样的倒装语法，必须使用正常语序；
- 尚未实现`do`关键字，且不支持任何类型的立刻执行；
- 慎用类，解释器的实现尚不完善；
- 数组的起始是`1`；
- 没有`import`和`export`，使用`# include xxx`替代这一功能；
- 没有`undefined`和`null`，使用空字符串`''`来替代；
- 没有列出的`js`内置函数几乎都不存在，需要自行实现；
- 没有隐式`return`，所有`return`都需要显示写出；

## Todo

- 匿名函数带入上下文
- `do`关键字
- 函数嵌套
- tree-shaking

## Toolkit

一个用于实现`js`部分内置函数，并提供少量基础功能函数的內建组件。

在文件头部添加如下内容引入

```coffee
# include ../toolkit/index.ahk
```

详细内容点击[这里](doc/toolkit.md)。
