# coffee-ahk

使用`coffeescript`来写`ahk`。

## Usage

```shell
npm i coffee-ahk
```

```typescript
import compile_ from 'coffee-ahk'

await compile_('./script/toolkit/index.coffee', {
  salt: 'toolkit',
  save: true,
  verbose: false
})
```

## Test

```shell
npm run test
```

## Notice

- `.coffee`文件编码使用`utf8`。`.ahk`文件编码使用`uft8 with BOM`；
- `ahk`中字符和数字的区别非常模糊，`'0'`在`ahk`中返回为`false`；
- `ahk`并不支持匿名函数，解释器所提供的模拟方案需要手动闭包提供上下文；
- 不推荐在`class`之外使用`=>`，因为`ahk`中的纯函数并没有`this`；
- 函数应在最外层声明。不在最外层声明的函数，其内部上下文须手动传入；
- 可以使用`true`、`false`、`on`和`off`，但要注意不要试图使用类型判断。在`ahk`中不存在`boolean`类型；
- 尚不支持`?`；
- 尚不支持`a = 1 unless a >= 1`这样的倒装语法，必须使用正常语序；
- 数组的起始是`1`；
- 没有`getter`/`setter`；
- 没有`import`和`export`，使用`# include xxx`替代这一功能；
- 没有`undefined`和`null`，使用空字符串`''`来替代；
- 没有列出的`js`内置函数几乎都不存在，需要自行实现；
- 没有隐式`return`，所有`return`都需要显式写出；

## Todo

- array starts from 0
- online preview
- target: v2
- tree-shaking