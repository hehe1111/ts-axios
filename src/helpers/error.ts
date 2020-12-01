import { AxiosRequestConfig, AxiosResponse } from '../types'

export class AxiosError extends Error {
  isAxiosError: boolean

  constructor(
    message: string,
    public config: AxiosRequestConfig,
    public code?: string | null,
    public request?: XMLHttpRequest,
    public response?: AxiosResponse
  ) {
    super(message)

    this.isAxiosError = true

    // 解决 TypeScript 继承一些内置对象的时候的坑
    // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, AxiosError.prototype)
  }
}

type ICreateError = {
  message: string
  config: AxiosRequestConfig
  code?: string | null
  request?: XMLHttpRequest
  response?: AxiosResponse
}
export const createError = ({
  message,
  config,
  code,
  request,
  response
}: ICreateError): AxiosError => {
  return new AxiosError(message, config, code, request, response)
}
