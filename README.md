# ts-axios

TypeScript/Rollup/Jest/Express/Webpack

## 开发

安装依赖

```bash
yarn
```

运行 `examples/`

```bash
yarn run dev
```

运行 `test/`

```bash
# 只展示测试覆盖率
yarn run test

# 展示每个测试的描述 + 测试覆盖率
yarn run test:verbose
```

## 功能

- axios 基础功能
  - 处理请求：url 参数、body、header
  - 处理响应：获取响应数据、处理 header、data
- 异常情况处理
- 拦截器
- 配置化
  - 合并配置
  - 请求、响应配置化
- 取消功能
- withCredentials
- XSRF 防御
- 上传和下载的进度监控
- HTTP 授权
- 自定义合法状态码
- 自定义参数序列化
- baseURL
- 静态方法扩展

## 测试

- `examples/`：Express + Webpack
- `test/`：Jest

## 其他

- [笔记](./note.md)

## 参考链接

- 来源 [基于 TypeScript 从零重构 axios](https://coding.imooc.com/class/330.html)
- 相关仓库 [yishibakaien/ts-axios](https://github.com/yishibakaien/ts-axios)
- 相关笔记 [TypeScript 从零实现 axios](https://liuyunhe.github.io/ts-axios-doc/chapter1/)
  - [liuyunhe/ts-axios-doc](https://github.com/liuyunhe/ts-axios-doc)
