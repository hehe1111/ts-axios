# 笔记

## 项目模板

- [typescript library starter](https://github.com/alexjoverm/typescript-library-starter)
  - TypeScript, RollupJS, Jest, Prettier, TSLint, Semantic Release, TypeDoc, Commitizen, husky, Conventional changelog

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
  - more: withCredentials/

### Jest