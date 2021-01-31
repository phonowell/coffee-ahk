# coffee-ahk

Translate `coffeescript` to `ahk`.

[中文](./readme-cn.md)

## Usage

```shell
npm i coffee-ahk
```

```typescript
import transpile_ from 'coffee-ahk'

await transpile_('. /script/toolkit/index.coffee', {
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

- Use `utf8` for `.coffee` file encoding. `.ahk` files are encoded using `uft8 with BOM`.
- The distinction between characters and numbers in `ahk` is blurred, with `'0'` returning `false` in `ahk`.
- `import` and `export` are not yet perfect.
- `npm` package management support is not yet complete.
- the use of `=>` outside of `class` is not recommended, since pure functions in `ahk` do not have `this`.
- `true`, `false`, `on` and `off` can be used, but be careful not to use type judgments. The `boolean` type does not exist in `ahk`.
- Does not yet support `? `.
- does not yet support inverted syntax like `a = 1 unless a >= 1`; normal order must be used.
- does not yet support `super`.
- no `getter`/`setter`.
- no `undefined` and `null`, using the empty string `''` instead.
- no implicit `return`, all `returns` need to be written explicitly.

## Todo

- Better type checking.