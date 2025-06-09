import globals from "globals"
import importPlugin from "eslint-plugin-import"
import prettierPlugin from "eslint-plugin-prettier"
import reactHooks from "eslint-plugin-react-hooks"
import reactPlugin from "eslint-plugin-react"
import reactRefresh from "eslint-plugin-react-refresh"
import tsParser from "@typescript-eslint/parser"
import tsPlugin from "@typescript-eslint/eslint-plugin"
import unusedImports from "eslint-plugin-unused-imports"

export default [{
  // 配置要忽略的文件和目录
  // 包括: 生成的文件、构建产物、依赖包、压缩文件
  ignores: [
    "src/__generated__",
    "**/dist/**",
    "**/node_modules/**",
    "**/*.min.js"
  ],
}, {
  // 指定要检查的文件类型: TypeScript和TypeScript React文件
  files: ["**/*.ts", "**/*.tsx"],
  // 语言选项配置
  languageOptions: {
    // 使用最新的ECMAScript版本
    ecmaVersion: "latest",
    // 同时支持浏览器和Node.js的全局变量
    globals: {
      ...globals.browser,
      ...globals.node,
    },
    // 使用TypeScript解析器
    parser: tsParser,
    parserOptions: {
      ecmaFeatures: {
        // 启用JSX支持
        jsx: true
      },
      // 启用TypeScript项目支持
      project: true
    },
    // 使用ES模块
    sourceType: "module"
  },
  // 启用的插件
  plugins: {
    "@typescript-eslint": tsPlugin,
    "import": importPlugin,
    "prettier": prettierPlugin,
    "react": reactPlugin,
    "react-hooks": reactHooks,
    "react-refresh": reactRefresh,
    "unused-imports": unusedImports
  },
  rules: {
    // @ts-ignore 使用规则
    // ✅ 允许: @ts-ignore - 这里忽略因为xxx
    // ❌ 禁止: 无描述的 @ts-ignore
    "@typescript-eslint/ban-ts-comment": ["error", {
      "ts-ignore": "allow-with-description"
    }],

    // 类型断言风格
    // ✅ 允许: const x = foo as number
    // ❌ 禁止: const x = <number>foo
    "@typescript-eslint/consistent-type-assertions": ["error", {
      assertionStyle: "as",
      objectLiteralTypeAssertions: "allow-as-parameter"
    }],

    // 类型定义方式
    // ✅ 推荐: type Person = { name: string }
    // ❌ 不推荐: interface Person { name: string }
    "@typescript-eslint/consistent-type-definitions": ["warn", "type"],

    // 类型导入方式
    // ✅ 推荐: import type { Type } from './types'
    // ❌ 不推荐: import { Type } from './types'
    "@typescript-eslint/consistent-type-imports": ["warn", {
      prefer: "type-imports"
    }],

    // 类成员访问性
    // ✅ 推荐: name = ''
    // ❌ 不推荐: public name = ''
    "@typescript-eslint/explicit-member-accessibility": ["warn", {
      accessibility: "no-public"
    }],

    // 方法签名风格
    // ✅ 推荐: greet: () => void
    // ❌ 不推荐: greet(): void
    "@typescript-eslint/method-signature-style": ["warn", "property"],

    // void 表达式检查已关闭
    "@typescript-eslint/no-confusing-void-expression": "off",

    // 空函数检查
    // ✅ 推荐: function foo() { doSomething() }
    // ❌ 不推荐: function foo() {}
    "@typescript-eslint/no-empty-function": "warn",

    // any 类型使用限制
    // ✅ 推荐: function foo(x: unknown)
    // ❌ 不推荐: function foo(x: any)
    "@typescript-eslint/no-explicit-any": ["warn", {
      fixToUnknown: true
    }],

    // 非空断言操作符
    // ✅ 推荐: if (obj) { obj.prop }
    // ❌ 不推荐: obj!.prop
    "@typescript-eslint/no-non-null-assertion": "warn",

    // 不必要的条件判断
    // ✅ 推荐: if (bool)
    // ❌ 不推荐: if (bool === true)
    "@typescript-eslint/no-unnecessary-condition": "warn",

    // 未使用的表达式
    // ✅ 允许: flag && doSomething(), condition ? a : b
    // ❌ 禁止: 1 + 2
    "@typescript-eslint/no-unused-expressions": ["error", {
      allowShortCircuit: true,
      allowTaggedTemplates: true,
      allowTernary: true,
      enforceForJSX: true
    }],

    // 未使用的变量检查已关闭，由 unused-imports 处理
    "@typescript-eslint/no-unused-vars": "off",

    // 未使用的导入
    // ❌ 禁止: 未使用的导入
    "unused-imports/no-unused-imports": "error",

    // 未使用的变量
    // ✅ 推荐: 使用下划线前缀标记未使用的变量
    // ❌ 不推荐: 声明但未使用的变量
    "unused-imports/no-unused-vars": [
      "warn",
      {
        "vars": "all",
        "varsIgnorePattern": "^_",
        "args": "after-used",
        "argsIgnorePattern": "^_",
      },
    ],

    // 空值合并运算符
    // ✅ 推荐: const x = foo ?? defaultValue
    // ❌ 不推荐: const x = foo || defaultValue
    "@typescript-eslint/prefer-nullish-coalescing": "warn",

    // 可选链运算符
    // ✅ 推荐: obj?.prop
    // ❌ 不推荐: obj && obj.prop
    "@typescript-eslint/prefer-optional-chain": "warn",

    // 模板字符串类型限制
    // ✅ 允许: `${number}`
    // ❌ 禁止: `${complex}`
    "@typescript-eslint/restrict-template-expressions": ["error", {
      allowNumber: true
    }],

    // 箭头函数体风格
    // ✅ 推荐: const foo = x => x * 2
    // ❌ 不推荐: const foo = x => { return x * 2 }
    "arrow-body-style": ["warn", "as-needed"],

    // 花括号使用规则
    // ✅ 推荐: if (foo) return;
    // ✅ 推荐: if (foo) { return; bar(); }
    // ❌ 不推荐: if (foo) { return; }
    "curly": ["warn", "multi-or-nest"],

    // 相等操作符
    // ✅ 允许: === 和 !==
    // ❌ 禁止: == 和 !=
    "eqeqeq": "error",

    // 函数风格
    // ✅ 推荐: const foo = () => {}
    // ❌ 不推荐: function foo() {}
    "func-style": ["warn", "expression"],

    // 导入顺序
    // 1. 样式文件最先导入
    // 2. polyfills 文件次先导入
    // 3. 按模块类型分组并字母排序
    'import/order': ['warn', {
      alphabetize: {
        caseInsensitive: true,
        order: 'asc',
        orderImportKind: 'asc'
      },
      groups: ['builtin', // node 内置模块
        'external', // 外部模块
        'internal', // 内部模块
        'parent', // 父级目录引用
        'sibling', // 同级目录引用
        'index', // 当前目录引用
        'object', // object imports
        'type' // type imports
      ],
      'newlines-between': 'always',
      pathGroups: [{
        group: 'builtin',
        pattern: '{.,@}/**/*.{css,scss,styl}',
        position: 'before'
      }, {
        group: 'builtin',
        pattern: '{.,@}/**/polyfills.{js,ts}',
        position: 'before'
      }],
      warnOnUnassignedImports: true
    }],

    // 导入项内部排序
    // ✅ 推荐: import { a, b, c } from 'module'
    // ❌ 不推荐: import { c, a, b } from 'module'
    'sort-imports': ['warn', {
      ignoreCase: true,
      ignoreDeclarationSort: true, // 忽略声明排序，使用 import/order 处理
      ignoreMemberSort: false,     // 对 import { a, b, c } 中的成员排序
      memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single']
    }],

    // 防止重复导入
    // ✅ 推荐: import { a, b } from 'module'
    // ❌ 不推荐: import { a } from 'module'; import { b } from 'module'
    'import/no-duplicates': 'warn',

    // 导入文件扩展名
    // ✅ 允许: import foo from './foo.js'
    // ❌ 禁止: import foo from './foo'
    'import/extensions': ['error', 'always', {
      ignorePackages: true
    }],

    // console 语句允许使用
    "no-console": "off",

    // 条件判断
    // ✅ 允许: while (condition)
    // ❌ 禁止: while (true)
    "no-constant-condition": "error",

    // debugger 语句
    // ✅ 推荐: 不使用 debugger
    "no-debugger": "warn",

    // 对象键重复
    // ❌ 禁止: { a: 1, a: 2 }
    "no-dupe-keys": "error",

    // else 中的 return
    // ✅ 允许: if (x) return 1; return 2
    // ❌ 禁止: if (x) return 1; else return 2
    "no-else-return": "error",

    // 全局对象访问
    // ✅ 推荐: window.toString
    // ❌ 不推荐: toString
    "no-restricted-globals": ["warn", 'toString'],

    // return await
    // ✅ 允许: return promise
    // ❌ 禁止: return await promise
    "no-return-await": "error",

    // 允许抛出字面量
    "no-throw-literal": "off",

    // 意外的多行表达式
    // ❌ 禁止: const x = 1 + 2
    //         + 3
    "no-unexpected-multiline": "error",

    // 不必要的三元表达式
    // ✅ 允许: const x = bool
    // ❌ 禁止: const x = bool ? true : false
    "no-unneeded-ternary": "error",

    // 不可达代码
    // ❌ 禁止: return; console.log()
    "no-unreachable": "error",

    // 无用的反向引用
    // ❌ 禁止: /(?:a){2}(?:a)/
    "no-useless-backreference": "error",

    // 不必要的 call/apply
    // ✅ 允许: foo()
    // ❌ 禁止: foo.call(undefined)
    "no-useless-call": "error",

    // 不必要的 catch
    // ❌ 禁止: try { foo() } catch (e) { throw e }
    "no-useless-catch": "error",

    // 不必要的计算属性
    // ✅ 推荐: obj.foo
    // ❌ 不推荐: obj['foo']
    "no-useless-computed-key": "warn",

    // 不必要的字符串连接
    // ✅ 推荐: 'ab'
    // ❌ 不推荐: 'a' + 'b'
    "no-useless-concat": "warn",

    // 不必要的构造函数
    // ✅ 推荐: 省略空构造函数
    // ❌ 不推荐: class C { constructor(){} }
    "no-useless-constructor": "warn",

    // 不必要的重命名
    // ✅ 推荐: const { foo }
    // ❌ 不推荐: const { foo: foo }
    "no-useless-rename": "warn",

    // 不必要的 return
    // ✅ 推荐: 函数末尾省略 return
    // ❌ 不推荐: return undefined
    "no-useless-return": "warn",

    // var 声明
    // ✅ 允许: const/let x = 1
    // ❌ 禁止: var x = 1
    "no-var": "error",

    // 对象属性简写
    // ✅ 推荐: { foo }
    // ❌ 不推荐: { foo: foo }
    "object-shorthand": "warn",

    // 变量声明
    // ✅ 推荐: let a; let b
    // ❌ 不推荐: var a, b
    "one-var": ["warn", "never"],

    // 回调函数
    // ✅ 推荐: arr.map(x => x * 2)
    // ❌ 不推荐: arr.map(function(x) { return x * 2 })
    "prefer-arrow-callback": "warn",

    // const 使用
    // ✅ 推荐: 对所有不会被重新赋值的变量使用 const
    "prefer-const": ["warn", {
      destructuring: "all"
    }],

    // 解构赋值
    // ✅ 推荐: const { prop } = obj
    // ❌ 不推荐: const prop = obj.prop
    "prefer-destructuring": ["warn", {
      AssignmentExpression: {
        array: false,
        object: false
      },
      VariableDeclarator: {
        array: false,
        object: true
      }
    }],

    // 指数运算符
    // ✅ 推荐: 2 ** 3
    // ❌ 不推荐: Math.pow(2, 3)
    "prefer-exponentiation-operator": "warn",

    // 数字字面量
    // ✅ 推荐: 0xFF
    // ❌ 不推荐: parseInt("FF", 16)
    "prefer-numeric-literals": "warn",

    // 对象展开
    // ✅ 推荐: { ...obj }
    // ❌ 不推荐: Object.assign({}, obj)
    "prefer-object-spread": "warn",

    // 模板字符串
    // ✅ 推荐: `Hello ${name}`
    // ❌ 不推荐: 'Hello ' + name
    "prefer-template": "warn",

    // Prettier 格式化规则
    // 不使用分号，使用单引号，保留尾随逗号
    "prettier/prettier": ["warn", {
      semi: false,
      singleQuote: true,
      trailingComma: "all"
    }],

    // React Hooks 依赖项检查
    // ✅ 允许: 完整列出依赖项
    // ❌ 禁止: 遗漏依赖项
    "react-hooks/exhaustive-deps": "error",

    // React Refresh 组件导出规则
    // ✅ 推荐: 导出常量组件
    'react-refresh/only-export-components': ['warn', {
      allowConstantExport: true
    }],

    // PropTypes 外部类型使用限制
    // ✅ 推荐: 在 propTypes 中使用外部类型
    'react/forbid-foreign-prop-types': ['warn', {
      allowInPropTypes: true
    }],

    // JSX 组件命名规范
    // ✅ 允许: MyComponent, ALL_CAPS
    // ❌ 禁止: myComponent
    'react/jsx-pascal-case': ['error', {
      allowAllCaps: true,
      ignore: []
    }],

    // React 导入检查已关闭
    'react/jsx-uses-react': 'off',

    // PropTypes 检查已关闭
    'react/prop-types': 'off',

    // JSX 的 React 作用域检查已关闭
    'react/react-in-jsx-scope': 'off',

    // 自闭合标签
    // ✅ 推荐: <div />
    // ❌ 不推荐: <div></div>
    "react/self-closing-comp": "warn",

    // async 函数
    // ✅ 允许: async function foo() { await something() }
    // ❌ 禁止: async function foo() { return 42 }
    "require-await": "error"
  },
  // React设置
  settings: {
    react: {
      // 自动检测React版本
      version: "detect"
    }
  }
}]
