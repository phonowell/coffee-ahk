# coffee-ahk

Translate `coffeescript` to `ahk`.

[Documentation](./doc.md)

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

- Does not yet support `? `.
- Does not yet support inverted syntax like `a = 1 unless a >= 1`; normal order must be used.
- No `NaN`, `null` and `undefined`, they are all converted to the empty string `''`.
- No `getter`/`setter`.
- No implicit `return`, all `returns` need to be written explicitly.
- The distinction between characters and numbers in `ahk` is blurred, with `'0'` returning `false` in `ahk`.
- The use of `=>` outside of `class` is not recommended, since pure functions in `ahk` do not have `this`.
- Use `utf8` for `.coffee` file encoding. `.ahk` files are encoded using `uft8 with BOM`.
- `import` and `export` are not yet perfect.
- `npm` package management support is not yet complete.
- `true`, `false`, `on` and `off` can be used, but be careful not to use type judgments. The `boolean` type does not exist in `ahk`.

## Todo

- Better type checking.