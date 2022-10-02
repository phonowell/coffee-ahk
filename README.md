# coffee-ahk

将`coffeescript`翻译到`ahk`。

Translate `coffeescript` to `ahk`.

[文档 | Documentation](./doc/documentation.md)

## Usage

```shell
pnpm i coffee-ahk
```

```typescript
import c2a from 'coffee-ahk'

await c2a('./script/toolkit/index.coffee', {
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

-
  尚不支持`?`；

  Does not yet support `? `.

-
  尚不支持`a = 1 unless a >= 1`这样的倒装语法，必须使用正常语序；

  Does not yet support inverted syntax like `a = 1 unless a >= 1`; normal order must be used.

-
  没有`NaN`、`null`和`undefined`，他们都被转化为空字符串`''`；

  No `NaN`, `null` and `undefined`, they are all converted to the empty string `''`.

-
  没有`getter`/`setter`；

  No `getter`/`setter`.
-
  没有隐式`return`，所有`return`都需要显式写出；

  No implicit `return`, all `returns` need to be written explicitly.

-
  `ahk`中字符和数字的区别很模糊，`'0'`在`ahk`中返回为`false`；

  The distinction between characters and numbers in `ahk` is blurred, with `'0'` returning `false` in `ahk`.

-
  不推荐在`class`之外使用`=>`，因为`ahk`中的纯函数并没有`this`；

  The use of `=>` outside of `class` is not recommended, since pure functions in `ahk` do not have `this`.

-
  `.coffee`文件编码使用`utf8`。`.ahk`文件编码使用`uft8 with BOM`；

  Use `utf8` for `.coffee` file encoding. `.ahk` files are encoded using `uft8 with BOM`.

-
  `import`和`export`尚不完善；

  `import` and `export` are not yet perfect.

-
  `npm`包管理支持尚不完善；

  `npm` package management support is not yet complete.
-
  可以使用`true`、`false`、`on`和`off`，但注意不要使用类型判断。在`ahk`中不存在`boolean`类型；

  `true`, `false`, `on` and `off` can be used, but be careful not to use type judgments. The `boolean` type does not exist in `ahk`.