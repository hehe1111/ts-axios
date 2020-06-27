import {
  AxiosRequestConfig,
  AxiosPromise,
  METHOD,
  AxiosResponse,
  ResolvedFn,
  RejectedFn
} from '../types'
import dispatchRequest from './dispatchRequest'
import InterceptorManager from './interceptorManager'

interface Interceptors {
  request: InterceptorManager<AxiosRequestConfig>
  response: InterceptorManager<AxiosResponse>
}

interface PromiseChain {
  resolved: ResolvedFn | ((config: AxiosRequestConfig) => AxiosResponse)
  rejected?: RejectedFn
}

export default class Axios {
  interceptors: Interceptors

  constructor() {
    this.interceptors = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>()
    }
  }

  request(url: string | AxiosRequestConfig, config?: AxiosRequestConfig): AxiosPromise {
    if (typeof url === 'string') {
      !config && (config = {})
      config.url = url
    } else {
      config = url
    }

    const chain: PromiseChain[] = [
      {
        // 发请求
        resolved: dispatchRequest,
        rejected: undefined
      }
    ]

    // 将用户添加的请求拦截器加到数组中，等待执行
    // 请求拦截器是先添加的后执行，因此用 unshift
    this.interceptors.request.forEach(interceptor => {
      chain.unshift(interceptor)
    })
    // 将用户添加的响应拦截器加到数组中，等待执行
    // 响应拦截器是先添加的先执行，因此用 push
    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor)
    })

    // 开始执行请求拦截器之前，需要传入 config 对象
    let promise = Promise.resolve(config)

    // 开始从前往后遍历数组，执行其中拦截器并且发请求并拿到响应
    // 顺序：
    // 请求拦截器n -> ... -> 请求拦截器1 -> 发请求并拿到响应 -> 响应拦截器1 -> ... -> 响应拦截器n
    while (chain.length) {
      const { resolved, rejected } = chain.shift()!
      promise = promise.then(resolved, rejected)
    }

    return promise as AxiosPromise
  }

  _requestWithoutData(method: METHOD, url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        method,
        url
      })
    )
  }

  _requestWithData(
    method: METHOD,
    url: string,
    data: any,
    config?: AxiosRequestConfig
  ): AxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        method,
        url,
        data
      })
    )
  }

  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithoutData('get', url, config)
  }
  delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithoutData('delete', url, config)
  }
  options(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithoutData('options', url, config)
  }
  head(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithoutData('head', url, config)
  }

  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithData('post', url, data, config)
  }
  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithData('put', url, data, config)
  }
  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithData('patch', url, data, config)
  }
}
