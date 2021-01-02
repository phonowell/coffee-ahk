# coffee-ahk

使用`coffeescript`来写`ahk`。
Use `coffeescript` to write `ahk`.

换言之，即是`js2ahk`。
In other words, it is `js2ahk`.

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
  Use `utf8` for `.coffee` file encoding. `.ahk` files are encoded using `uft8 with BOM`.

- `ahk`中字符和数字的区别非常模糊，`'0'`在`ahk`中返回为`false`；
  The distinction between characters and numbers in `ahk` is very blurred, `'0'` returns `false` in `ahk`.

- `import`和`export`模拟尚不完善；
  `import` and `export` mockups are not yet complete.

- 不推荐在`class`之外使用`=>`，因为`ahk`中的纯函数并没有`this`；
  The use of `=>` outside of `class` is not recommended, since pure functions in `ahk` do not have `this`.

- 可以使用`true`、`false`、`on`和`off`，但要注意不要试图使用类型判断。在`ahk`中不存在`boolean`类型；
  `true`, `false`, `on` and `off` may be used, but be careful not to attempt to use type judgments. The type `boolean` does not exist in `ahk`.

- 尚不支持`?`；
  Does not yet support `? `.

- 尚不支持`a = 1 unless a >= 1`这样的倒装语法，必须使用正常语序；
  Inversion syntax such as `a = 1 unless a >= 1` is not yet supported, do use normal order.

- 没有`getter`/`setter`；
  No `getter`/`setter`.

- 没有`super`；
  No `super`.

- 没有`undefined`和`null`，使用空字符串`''`来替代；
  No `undefined` and `null`, use empty string `''` instead.

- 没有隐式`return`，所有`return`都需要显式写出；
  No implicit `return` yet, all `return`s need to be written explicitly.

## Todo

- online preview