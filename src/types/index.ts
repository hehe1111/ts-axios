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
  params?: any
  data?: any
  headers?: any
}
