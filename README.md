# coffee-ahk

Translate `coffeescript` to `ahk`.

[Documentation](./doc/documentation.md) | [文档](./doc/cn/documentation.md)

## Usage

```shell
pnpm i coffee-ahk
```

```typescript
import c2a from 'coffee-ahk'

await c2a('./script/toolkit/index.coffee', {
  salt: 'toolkit',
  save: true,
  verbose: false,
})
```

## Test

```shell
npm run test
```

## Notice

- Not yet supported `? `;

- Does not yet support inverted syntax such as `a = 1 unless a >= 1`; normal syntax must be used;

- No `NaN`, `null` and `undefined`, which are all converted to the empty string `''`;

- No `getter`/`setter`;

- No implicit `return`, all `return`s must be written explicitly;

- The distinction between characters and numbers in `ahk` is blurred, `'0'` returns `false` in `ahk`;

- Using `=>` outside of `class` is not recommended, because pure functions in `ahk` do not have `this`;

- Use `utf8` for encoding `.coffee` files. The encoding of `.ahk` files uses `uft8 with BOM`;

- Import and export are not yet complete;

- Npm package management support is not complete;

- You can use `true`, `false`, `on` and `off`, but be careful not to use type judgments. The `boolean` type does not exist in `ahk`;
