# coffee-ahk

将`coffeescript`翻译到`ahk`。

## Usage

```shell
npm i coffee-ahk
```

```typescript
import transpile_ from 'coffee-ahk'

await transpile_('./script/toolkit/index.coffee', {
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
- `ahk`中字符和数字的区别很模糊，`'0'`在`ahk`中返回为`false`；
- `import`和`export`尚不完善；
- 不推荐在`class`之外使用`=>`，因为`ahk`中的纯函数并没有`this`；
- 可以使用`true`、`false`、`on`和`off`，但注意不要使用类型判断。在`ahk`中不存在`boolean`类型；
- 尚不支持`?`；
- 尚不支持`a = 1 unless a >= 1`这样的倒装语法，必须使用正常语序；
- 尚不支持`super`；
- 尚不支持包管理；
- 没有`getter`/`setter`；
- 没有`undefined`和`null`，使用空字符串`''`来替代；
- 没有隐式`return`，所有`return`都需要显式写出；

## Todo

- 加入`npm`包管理支持；
- 更完善的类型检查；