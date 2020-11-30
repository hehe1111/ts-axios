export type METHOD =
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
  url?: string
  method?: METHOD
  params?: any // 请求查询参数
  data?: any // 请求带上的数据
  headers?: any // 请求头 headers
  responseType?: XMLHttpRequestResponseType // 希望服务器返回响应的数据类型
  timeout?: number // 超时时间
  [key: string]: any
  transformRequest?: AxiosTransformer | AxiosTransformer[]
  transformResponse?: AxiosTransformer | AxiosTransformer[]
  cancelToken?: CancelToken
  xsrfCookieName?: string
  xsrfHeaderName?: string
  onDownloadProgress?: (event: ProgressEvent) => void
  onUploadProgress?: (event: ProgressEvent) => void
  auth?: AxiosBasicCredentials
  validateStatus?: (status: number) => boolean
  paramsSerializer?: (params: any) => string
  baseURL?: string
}

export interface AxiosTransformer {
  (data: any, headers?: any): any
}

// Cancel 类的实例类型
export interface Cancel {
  message?: string
}

// Cancel 类的类类型
export interface CancelStatic {
  new (message?: string): Cancel
}

// CancelToken 类的实例类型
export interface CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  throwIfRequested(): void
}

export interface Canceler {
  (message?: string): void
}

export interface CancelExecutor {
  (cancel: Canceler): void
}

export interface CancelTokenSource {
  token: CancelToken
  cancel: Canceler
}

// CancelToken 类的类类型
export interface CancelTokenStatic {
  new (executor: CancelExecutor): CancelToken
  source(): CancelTokenSource
}

export interface AxiosBasicCredentials {
  username: string
  password: string
}

export interface AxiosResponse<T = any> {
  data: T // 服务器返回的数据
  status: number // HTTP 状态码
  statusText: string // 状态消息
  headers: any // 响应头 headers
  config: AxiosRequestConfig // 请求配置对象
  request: XMLHttpRequest // 请求的 XMLHttpRequest 对象实例
}

// 当 axios 返回的是 AxiosPromise 类型，那么 resolve 函数中的参数就是一个 AxiosResponse 类型
export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {}

export interface AxiosError extends Error {
  isAxiosError: boolean
  config: AxiosRequestConfig
  code?: string | null
  request?: XMLHttpRequest
  response?: AxiosResponse
}

export interface Axios {
  defaults: AxiosRequestConfig
  interceptors: {
    request: InterceptorManager<AxiosRequestConfig>
    response: InterceptorManager<AxiosResponse>
  }

  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>

  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosInstance extends Axios {
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosStatic extends AxiosInstance {
  create(config?: AxiosRequestConfig): AxiosInstance

  CancelToken: CancelTokenStatic
  Cancel: CancelStatic
  isCancel: (value: any) => boolean
}

export interface ResolvedFn<T = any> {
  // 返回的类型中
  // T 是给请求拦截器用的(config)
  // Promise<T> 是给响应拦截器用的(response)
  (value: T): T | Promise<T>
}

export interface RejectedFn {
  (error: any): any
}

export interface InterceptorManager<T> {
  // 添加拦截器
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number
  // 取消拦截器
  eject(id: number): void
}
