import { isPlainObject } from './utils'

export const normalizeHeaders = (headers: any, normalizedName: string) => {
  if (!headers) {
    return
  }

  Object.keys(headers).map(name => {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = headers[name]
      delete headers[name]
    }
  })
}

export const processHeaders = (headers: any, data: any): any => {
  // 请求 header 属性是大小写不敏感的，故需要预先处理一下
  normalizeHeaders(headers, 'Content-Type')

  // HTTP 只能传递字符串
  // 对于普通对象，需要将对象序列化成对象字符串
  // 对于对象字符串，需要设置 Content-Type 为 application/json
  // 否则服务器即使接受到对象字符串，也只会当成纯文本去解析，而不会解析成 JSON 对象
  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json; charset=utf-8'
    }
  }

  return headers
}
