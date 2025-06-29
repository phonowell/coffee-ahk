# Changelog

## v66 @ 2025/06/29

- 修复：修正了 `import/export` 模块在导出复杂匿名函数时的异常。
- 修复：修正了 `import/export` 模块在使用 `class` 关键字时的异常。
- 修复：修正了 `anonymous` 模块导致内建函数无法正确处理的问题。
- 修复：修正了 `builtins` 模块导致内建函数无法正确处理的问题。
- 变更：移除了编译器的 `anonymous`、`builtins` 和 `track` 选项。
- 重大变更：重构 `class` 相关逻辑，类名现在必须以大写字母开头，且与变量/函数/参数名不能重名。所有类名在渲染时大写字母会被替换为全角字符，实现 AHK v1 下的“伪大小写敏感”。

- Fix: Resolved an error in the `import/export` module that caused failures when exporting complex anonymous functions.
- Fix: Resolved an error in the `import/export` module when using the `class` keyword.
- Fix: Resolved an issue in the `anonymous` module that prevented built-in functions from being handled correctly.
- Fix: Resolved an issue in the `builtins` module that prevented built-in functions from being handled correctly.
- Change: Removed the `anonymous`, `builtins`, and `track` options from the compiler.
- Breaking Change: Refactored class handling. Class names must now start with an uppercase letter and cannot conflict with any variable, function, or parameter name. All class identifiers are rendered with uppercase letters replaced by full-width Unicode to simulate case sensitivity in AHK v1.
