export type METHODS =
  | 'GET'
  | 'get'
  | 'POST'
  | 'post'
  | 'PUT'
  | 'put'
  | 'DELETE'
  | 'delete'
  | 'PATCH'
  | 'patch'
  | 'OPTIONS'
  | 'options'
  | 'HEAD'
  | 'head'

export interface AxiosRequestConfig {
  url: string
  method?: METHODS
  params?: any // 请求查询参数
  data?: any // 请求带上的数据
  headers?: any // 请求头 headers
  responseType?: XMLHttpRequestResponseType // 希望服务器返回响应的数据类型
}

export interface AxiosResponse {
  data: any // 服务器返回的数据
  status: number // HTTP 状态码
  statusText: string // 状态消息
  headers: any // 响应头 headers
  config: AxiosRequestConfig // 请求配置对象
  request: XMLHttpRequest // 请求的 XMLHttpRequest 对象实例
}

// 当 axios 返回的是 AxiosPromise 类型，那么 resolve 函数中的参数就是一个 AxiosResponse 类型
export interface AxiosPromise extends Promise<AxiosResponse> {}
