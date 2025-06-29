# Changelog

## v65 @ 2025/06/29

- 修复了一个`import/export`模块的错误，该错误会导致直接导出复杂匿名函数时出错。
- 修复了一个`import/export`模块的错误，该错误会使用`class`关键字时出错。
- 修复了一个`anonymous`模块的错误，该错误会导致内建函数无法正确处理。
- 修复了一个`builtins`模块的错误，该错误会导致内建函数无法正确处理。
- 移除了编译器的`anonymous`、`builtins`和`track`选项。
