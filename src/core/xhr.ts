import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'
import { isURLSameOrigin } from '../helpers/url'
import cookie from '../helpers/cookie'
import { isFormData } from '../helpers/utils'

export default (config: AxiosRequestConfig): AxiosPromise => {
  return new Promise((resolve, reject) => {
    const {
      url,
      method,
      data,
      headers = {},
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress,
      auth,
      validateStatus
    } = config

    const xhr = new XMLHttpRequest()
    // 默认配置中 method 默认为 get
    xhr.open(method!.toUpperCase(), url!)
    configureRequest()
    handleCancel()
    handleRequestHeaders()
    addEevnts()
    xhr.send(data)

    /* === 工具函数 === */

    function configureRequest() {
      responseType && (xhr.responseType = responseType)
      timeout && (xhr.timeout = timeout)
      withCredentials && (xhr.withCredentials = true)
      auth && (headers['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password))
    }

    function handleCancel() {
      cancelToken &&
        cancelToken.promise.then(reason => {
          xhr.abort()
          reject(reason)
        })
    }

    function handleRequestHeaders() {
      if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
        const xsrfValue = cookie.read(xsrfCookieName)
        xsrfValue && (headers[xsrfHeaderName!] = xsrfValue)
      }

      // 如果请求的数据是 FormData 类型，应该主动删除请求 headers 中的 Content-Type 字段，让浏览器自动根据请求数据设置 Content-Type
      isFormData(data) && delete headers['Content-Type']
      // 需要在执行过 open 方法后，才可以去处理 headers
      // 如果没有 data，则删除 Content-Type
      Object.keys(headers).map(name => {
        if ((data === undefined || data === null) && name.toLocaleLowerCase() === 'content-type') {
          delete headers[name]
        } else {
          xhr.setRequestHeader(name, headers[name])
        }
      })
    }

    function addEevnts() {
      xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4) {
          return
        }

        if (xhr.status === 0) {
          // 可能的场景
          // 1. 网络错误
          // 2. 超时
          // ...
          return
        }

        const responseHeaders = parseHeaders(xhr.getAllResponseHeaders())
        // 注意根据 responseType 的不同，需要从不同的地方拿数据
        const responseData =
          responseType && responseType !== 'text' ? xhr.response : xhr.responseText
        const response: AxiosResponse = {
          data: responseData,
          status: xhr.status,
          statusText: xhr.statusText,
          headers: responseHeaders,
          config,
          request: xhr
        }

        handleResponse(response)
      }

      xhr.onerror = () => {
        reject(createError({ message: 'Network Error.', config, code: null, request: xhr }))
      }

      xhr.ontimeout = () => {
        reject(
          createError({
            message: `Timeout of ${timeout}ms exceeded.`,
            config,
            code: 'ECONNABORTED',
            request: xhr
          })
        )
      }

      onDownloadProgress && (xhr.onprogress = onDownloadProgress)
      onUploadProgress && (xhr.upload.onprogress = onUploadProgress)
    }

    function handleResponse(response: AxiosResponse): void {
      if (!validateStatus || validateStatus(response.status)) {
        resolve(response)
      } else {
        reject(
          createError({
            message: `Request failed with status code ${response.status}`,
            config,
            code: null,
            request: xhr,
            response
          })
        )
      }
    }
  })
}
