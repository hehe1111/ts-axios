import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'

export default (config: AxiosRequestConfig): AxiosPromise => {
  return new Promise((resolve, reject) => {
    const {
      url,
      method = 'get',
      data,
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials
    } = config
    const xhr = new XMLHttpRequest()

    responseType && (xhr.responseType = responseType)

    timeout && (xhr.timeout = timeout)

    cancelToken &&
      cancelToken.promise.then(reason => {
        xhr.abort()
        reject(reason)
      })

    withCredentials && (xhr.withCredentials = true)

    xhr.open(method.toUpperCase(), url!)

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
      const responseData = responseType && responseType === 'text' ? xhr.responseText : xhr.response
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
      console.log('onerror xhr.status=', xhr.status)
      reject(createError('Network Error.', config, null, xhr))
    }

    xhr.ontimeout = () => {
      console.log('ontimeout xhr.status=', xhr.status)
      reject(createError(`Timeout of ${timeout}ms excceed.`, config, 'ECONNABORTED', xhr))
    }

    // 需要在执行过 open 方法后，才可以去处理 headers
    Object.keys(headers).map(name => {
      if (data === null && name.toLocaleLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        xhr.setRequestHeader(name, headers[name])
      }
    })

    xhr.send(data)

    /* 工具函数 */
    const handleResponse = (response: AxiosResponse): void => {
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        reject(
          createError(
            `Request failed with status code ${response.status}`,
            config,
            null,
            xhr,
            response
          )
        )
      }
    }
  })
}
