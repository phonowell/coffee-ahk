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
- `=>`不可用。实际上由于`ahk`和`js`在`this`上的差异，这个关键字很难实现；
- `ahk`中字符和数字的区别非常模糊，`'0'`在`ahk`中返回为`false`；
- `ahk`并不支持匿名函数，解释器所提供的模拟方案需要手动闭包提供上下文；
- 函数应在最外层声明。不在最外层声明的函数，其内部上下文须手动传入；
- 可以使用`true`、`false`、`on`和`off`，但要注意不要试图使用类型判断。在`ahk`中不存在`boolean`类型；
- 尚不支持`?`；
- 尚不支持`a = 1 unless a >= 1`这样的倒装语法，必须使用正常语序；
- 尚未实现`do`关键字，且不支持任何类型的立刻执行；
- 慎用类，解释器的实现尚不完善；
- 数组的起始是`1`；
- 没有`import`和`export`，使用`# include xxx`替代这一功能；
- 没有`undefined`和`null`，使用空字符串`''`来替代；
- 没有列出的`js`内置函数几乎都不存在，需要自行实现；
- 没有隐式`return`，所有`return`都需要显式写出；

## Todo

- online preview
- tree-shaking

## Contact

QQ: 515565970