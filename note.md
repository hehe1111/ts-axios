# 笔记



## 项目模板

- [typescript library starter](https://github.com/alexjoverm/typescript-library-starter)
  - TypeScript, RollupJS, Jest, Prettier, TSLint, Semantic Release, TypeDoc, Commitizen, husky, Conventional changelog

## tsconfig

```jsonc
{
  // https://www.typescriptlang.org/docs/handbook/compiler-options.html
  "compilerOptions": {
    "moduleResolution": "node",
    "target": "es5",
    "module": "es2015",
    "lib": ["es2015", "es2016", "es2017", "dom"],
    "strict": true,
    // 启用 --strict 相当于启用
    // --noImplicitAny
    // --noImplicitThis
    // --alwaysStrict
    // --strictNullChecks
    // --strictFunctionTypes
    // --strictPropertyInitialization
    "sourceMap": true,
    "declaration": true,
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "declarationDir": "dist/types",
    "outDir": "dist/lib",
    "typeRoots": ["node_modules/@types"]

    // https://www.typescriptlang.org/docs/handbook/tsconfig-json.html
    // "removeComments": true,

    // 解决「无法重新声明块范围变量」的提示报错
    // https://www.cnblogs.com/libinfs/p/11857187.html
    // "target": "esnext",
    // "module": "commonjs",
    // "noImplicitReturns": true,
    // "noUnusedLocals": true,
    // "esModuleInterop": true
  },
  "include": ["src"]
}
```

## HTTP 基础

- 请求时，查询参数会被转成字符串形式追加到 url 上。**`params` 对象里如果含有数组、Date 对象、JSON 对象、特殊字符时，需要做特殊处理**。如果是空值，则需要丢弃
- `xhr.open()` 执行后，才可以去处理请求头 `headers`
- HTTP 请求时，**data 部分如果是 JSON 对象，需要转成字符串形式**，_因为 HTTP 请求只支持传输文本或二进制_。且请求头需要加上 `Content-Type: "application/json; charset=utf-8"`，如果不加上请求头，则默认为 `Content-Type: "text/plain; charset=UTF-8"`，这样会导致服务端不能将 JSON 对象字符串正确解析为 JSON 对象，而是直接当作字符串处理。如果是 `Content-Type: "application/x-www-form-urlencoded"`，则请求 data 也不应该是 JSON 对象（如： `{a:1, b:2}`），而应该转换成 `a=1&b=2` 形式的字符串
  - `Content-Type: "application/json; charset=utf-8"`: `JSON.stringify({a:1, b:2})` => `"{a:1, b:2}"`
  - `Content-Type: "application/x-www-form-urlencoded"`: `qs.stringify({a:1, b:2})` => `a=1&b=2`
  - 请求头一定要根据要发送的 data 的内容声明好对应的 `Content-Type`，以便服务器能正确解析请求内容
- `xhr.send()` 的参数支持 `Document` 和 `BodyInit` 类型，`BodyInit` 包括了 `Blob`, `BufferSource`, `FormData`, `URLSearchParams`, `ReadableStream`、`USVString`，当没有数据的时候，还可以传入 `null`
- 如果请求指定了 `responseType`，但是服务器返回的数据的类型不符合指定的类型，则 `response` 的值会为 `null`
  - [XMLHttpRequest.responseType](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType)
- `withCredentials`
  - 在同一个站点下使用 `withCredentials` 属性是无效的（也没有必要）
  - 在同域的情况下，发送请求会默认携带当前域下的 cookie，但是在跨域的情况下，默认是不会携带**请求域下的 cookie** 的，比如 `http://domain-a.com` 站点发送一个 `http://api.domain-b.com/get` 的请求，默认是不会携带 `api.domain-b.com` 域下的 cookie，如果想携带（很多情况下是需要的），只需要设置请求的 xhr 对象的 `withCredentials` 为 `true` 即可
  - [ ] 疑问：从 a 域名请求 b 域名，设置 `withCredentials: true` 的前提下，请求会带上的是 a 下的 cookie 还是 b 下的？还是两者都带？
  - 同时需要**前后端配合**
    - 前端 `xhr.withCredentials = true`
    - 后端 `Access-Control-Allow-Credentials: true` + `Access-Control-Allow-Origin: 指定域名`
  - 参考链接：
    - [关于 withCredentials 和 CORS[项目笔记]](https://juejin.cn/post/6844903938936799245)
    - [Http requests withCredentials what is this and why using it?](https://stackoverflow.com/a/27407440/14449377)

## 处理请求

- url 参数: param（get 请求）
- body（post 请求）
- 请求 header
  - Content-Type

## 处理响应

- 如何拿到响应：**Promise 化**。调用 axios 时，会去调用以下函数，然后发出请求，并会返回一个 Promise 实例。在 `new Promise(fn)` 的 fn 内去监听响应状态变化，从而拿到响应

```ts
export default (config: AxiosRequestConfig): AxiosPromise => {
  return new Promise(resolve => {
    // ...

    xhr.open(/*...*/)
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) {
        return
      }

      // 做一些处理并拿到 response

      resolve(response)
    }

    // 处理 headers

    xhr.send(data)
  })
}
```

- 处理响应 data
- 响应 header
  - responseType

## 其他

- [ ] axios 不单单是一个方法，更像是一个混合对象，**本身是一个方法，又有很多方法属性**
- [ ] 工厂函数 `createInstance` 代码实现

## 拦截器实现

> **难点**

- [ ] **归纳**示例笔记

## 合并配置的设计与实现

- 默认配置定义
  - `method: 'get'`
  - `timeout: 0`
  - `post`/`put`/`patch`: `{'Content-Type': 'application/x-www-form-urlencoded'}`
- 添加到 axios 对象中
- 合并 config （在 `request` 函数内进行合并）
  - 默认合并策略
  - 只接受自定义配置合并策略 **难点** `src/core/mergeConfig.ts`
  - 复杂对象合并策略 **难点**
  - flatten headers

## 请求和响应配置化

- `config.transformRequest`/`config.transformResponse` 值可以是数组或是函数
- 把之前对请求数据和响应数据的处理逻辑，放到了默认配置中，也就是**默认处理逻辑**
  - 请求：`contentTypeJson` `stringifyData`
  - 响应：`parseData`

## 扩展 `axios.create` 静态接口

- 通过 `axios.create(config)` 创建新的 axios 实例，可以传入新配置，需要将传入的**新配置和默认配置合并**

## 取消功能的设计与实现

> **难点**

- 原理：调用 `xhr.abort()` - [`XMLHttpRequest.abort()`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/abort)
- 实现原理（套路）总结
  1. 外界传入一个函数 A 给 CancelToken
  2. CancelToken 执行时，传入另一个函数 B 作为 A 函数的参数，并执行 A
  3. 因此，**外界就可以在 A 函数中拿到对 B 函数的引用 cancel**。CancelToken 在 B 函数内保存一个 pending 状态的 Promise 对象，当外界执行 `cancel` 方法时，能够访问到这个 Promise 对象，把它从 pending 状态变成 resolved 状态，这样就可以**在 `then` 函数中去实现取消请求的逻辑**（利用了 Promise 实现了*异步分离*）

伪代码

```js
class CancelToken {
  constructor(aFn) {
    let resolveFn
    this.promise = new Promise(resolve => (resolveFn = resolve))
    const bFn = message => {
      if (this.reason) return
      this.reason = message
      resolveFn(this.reason)
    }
    aFn(bFn)
  }
}

axios({
  cancelToken: new CancelToken(c => (cancel = c))
})

cancel()
```

```js
// xhr.ts
if (config.cancelToken) {
  config.cancelToken.promise.then(reason => {
    xhr.abort()
    reject(reason)
  })
}
```

- CancelToken 扩展静态接口
  - 支持 `CancelToken.source()` 调用，以上伪代码仅支持 `new CancelToken()` 调用
  - 实际上也就是调用 `new CancelToken(c => (cancel = c))`

```js
class CancelToken {
  // ...
  static source() {
    let cancel
    const token = new CancelToken(c => (cancel = c))
    return { cancel, token }
  }
}
```

- Cancel 类实现及 axios 的扩展
  - 支持 `axios.isCancel()` 判断请求是否被取消
- 额外逻辑实现
  - 当一个请求携带的 `cancelToken` 已经被使用过，那么甚至都可以不发送这个请求，只需要抛一个异常即可

## withCredentials

```js
if (withCredentials) {
  xhr.withCredentials = true
}
```

## XSRF/CSRF 防御

### 防御手段

- （1）验证请求的 `referer`：**不安全**，`referer` 是可以伪造的
- （2）**服务器端要求每次请求都包含一个 token**，这个 token 不在前端生成，而是在用户每次访问站点的时候生成，并通过 `set-cookie` 的方式种到客户端，然后客户端发送请求的时候，从 `cookie` 中对应的字段读取出 token，然后添加到请求 `headers` 中。这样服务端就可以从请求 `headers` 中读取这个 token 并验证，由于这个 token 是很难伪造的，所以就能区分这个请求是否是用户正常发起的

### 基于防御手段（2）的大致实现流程

如果**同域**或 **`withCredential: true`** 则读取 cookie 中 `xsrfCookieName` 对应的 key 的值 C，然后以 `xsrfHeaderName` 对应作为 `header` 字段 key，C 作为值设置请求头

`xsrfCookieName`：存储 token 的 `cookie` 名称

`xsrfHeaderName`：请求 `headers` 中 token 对应的 `header` 名称

- 判断是否同域或者 `withCredential: true`
  - 同域名的判断主要利用了一个技巧，创建一个 `a` 标签的 DOM，然后设置 `href` 属性为传入的 `url`，然后可以直接获取该 DOM 的 `protocol`、`host`
- cookie 的读取
- 设置请求头 header

## 上传和下载的进度监控

### 上传和下载的进度监控原理

> `xhr` 对象提供了一个 `progress` 事件，可以监听此事件对数据的下载进度做监控；另外，`xhr.uplaod` 对象也提供了 `progress` 事件，可以基于此对上传进度做监控

`e.loaded` 已上传/已下载的量

`e.total` 需要上传/下载的总量

如果请求的数据是 `FormData` 类型，应该主动删除请求 `headers` 中的 `Content-Type` 字段，让浏览器自动根据请求数据设置 `Content-Type`

实现上比较简单，就是传入两个函数（如果有），比较难的是如何**实现示例**

```js
onDownloadProgress && (xhr.onprogress = onDownloadProgress)
onUploadProgress && (xhr.upload.onprogress = onUploadProgress)
```

### 上传文件

- 前端

```html
<form role="form" class="form" onsubmit="return false;">
  <input id="file" type="file" class="form-control" />
  <button id="upload" type="button" class="btn btn-primary">Upload</button>
</form>
```

`onsubmit="return false;"` 提交时阻止默认行为

```js
const uploadEl = document.getElementById('upload')
uploadEl!.addEventListener('click', e => {
  const data = new FormData()
  const fileEl = document.getElementById('file') as HTMLInputElement
  if (fileEl.files) {
    data.append('file', fileEl.files[0])
    instance.post('/more/upload', data)
  }
})
```

- 后端接收被上传的文件

需要在 `server.js` 所在的目录下创建 `uploaded-file/` 目录，用于存放被上传的文件

```js
// server.js

const express = require('express')
const path = require('path')
const multipart = require('connect-multiparty')

const app = express()

app.use(
  multipart({
    uploadDir: path.resolve(__dirname, 'uploaded-file')
  })
)
```

## HTTP 授权

请求 header 会包含服务器用于验证用户代理身份的凭证，通常会在服务器返回 `401 Unauthorized` 状态码以及 `WWW-Authenticate` 消息头之后在后续请求中发送此消息头

axios 允许在请求配置中配置 `auth` 属性，`auth` 是一个对象结构，包含 `username` 和 `password` 2 个属性。一旦用户在请求的时候配置这俩属性，axios 就会自动往 HTTP 的请求 header 中添加 `Authorization` 属性，它的值为 `Basic 加密串`。 这里的加密串是 `username:password` base64 加密后的结果

## 自定义合法状态码

## 自定义参数序列化

[URLSearchParams](https://developer.mozilla.org/zh-CN/docs/Web/API/URLSearchParams)

## baseURL

## 静态方法扩展

`axios.all`、`axios.spread`

`axios.Axios`

`axios.getUri`

## 测试

### express + webpack 多页面项目

- 两个用途：
  1. 静态资源服务器： webpack 多页面/打包/HMR
  2. api 服务器：作为后台处理请求
- 多页面应用
  - 多个目录
  - 一个目录下各有一个 index.html 和一个入口 js 文件 app.ts
  - （待完成）一个目录下有多个 .html 文件和多个入口 .js 文件
- examples/ 阅读顺序
  - simple: get
  - base: get/post; promise
  - error
  - extend: request/get/post/put/patch/delete/options/head
  - interceptor
  - config
  - cancel
  - more-with-credential
  - more-xsrf
  - more-upload-download
  - more-authorization
  - more-status-code
  - more-params-serialization
  - more-base-url
  - more-extend

### Jest

- `describe('描述', () => {/* 测试用例 */})`
- 测试用例：`test('描述', () => {/* 测试语句 */})`
  - **`test` 函数别名 `it`**
- 测试语句：
  - `expect(/*...*/).toEqual()` 比较两个值是否相等（对于嵌套对象会进行递归比较）
  - `expect(/*...*/).toBe()` 使用严格相等进行比较。不要用于「浮点数」
  - `expect(/*...*/).not.toBe()`
  - `expect(/*...*/).toBeNull()`
  - `expect(/*...*/).toBeUndefined()`
  - `expect(/*...*/).toBeTruthy()`
  - `expect(/*...*/).toBeFalsy()`
  - `expect(/* instance */).toBeInstanceOf(/* constructor */)`
  - `fail()`
  - `done.fail()`
- `/* istanbul ignore next */` 主要用途就是用来**忽略测试**用的，这个技巧不可滥用，除非明确的知道某段代码不需要测试，否则不应该使用它。滥用就失去了单元测试的意义了。

### jasmine-ajax

会为发出的 Ajax 请求根据规范**定义一组假的响应**，并跟踪发出的 Ajax 请求，可以方便的为结果做断言

## 发布

`npm view [<@scope>/]<pkg>[@<version>]` 搜索一个包名是否已经存在

`release.sh`

```sh
#!/usr/bin/env sh
set -e
echo "Enter release version: "
read VERSION
read -p "Releasing $VERSION - are you sure? (y/n)" -n 1 -r
echo  # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "Releasing $VERSION ..."

  # commit
  git add -A
  git commit -m "[build] $VERSION"
  npm version $VERSION --message "[release] $VERSION"
  git push origin master

  # publish
  npm publish
fi
```

`#!/usr/bin/env sh` 用来表示是一个 shell 脚本

`set -e` 告诉脚本如果执行结果不为 `true` 则退出

`read VERSION` 表示从标准输入读取值，并赋值给 `$VERSION` 变量。此处输入的值会自动同步到 `package.json` 中的 `version` 字段。

`read -p "Releasing $VERSION - are you sure? (y/n)" -n 1 -r`，其中 `read -p` 表示给出提示符，后面接着 `Releasing $VERSION - are you sure? (y/n)` 提示符；`-n 1` 表示限定**最多可以有 1 个字符可以作为有效读入**；`-r` 表示**禁止反斜线的转义功能**。因为此处的 `read` 并没有指定变量名，那么默认这个输入读取值会赋值给 `$REPLY` 变量

`if [[ $REPLY =~ ^[Yy]$ ]]` 表示 shell 脚本中的流程控制语句，判断 `$REPLY` 是不是大小写的 `y`，如果满足，则走到后面的 `then` 逻辑。

`git commit -m "[build] $VERSION"` 提交后，查看 git commit 历史时，会发现 commit 上自动打了 tag

举例

```
* ef4a47a - (tag: v0.0.1, origin/master) [release] 0.0.1 (11 minutes ago) <hehe1111>
```

- `package.json`

```jsonc
{
  "files": ["dist"], // 要发布到 npm 上的文件和目录
  "scripts": {
    "prebuild": "rimraf dist",
    "build": "tsc --module commonjs && rollup -c rollup.config.ts && typedoc --out docs --target es6 --theme minimal --mode file src"
  }
}
```

`preXXX` 的命令默认会在 `XXX` 命令之前执行
