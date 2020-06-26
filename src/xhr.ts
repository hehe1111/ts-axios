import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types'
import { parseHeaders } from './helpers/headers'

export default (config: AxiosRequestConfig): AxiosPromise => {
  return new Promise((resolve, reject) => {
    const { url, method = 'get', data, headers, responseType, timeout } = config
    const xhr = new XMLHttpRequest()
    if (responseType) {
      xhr.responseType = responseType
    }
    if (timeout) {
      xhr.timeout = timeout
    }

    xhr.open(method.toUpperCase(), url)

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) {
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

      resolve(response)
    }

    xhr.onerror = () => {
      reject(new Error('Network Error.'))
    }

    xhr.ontimeout = () => {
      reject(new Error(`Timeout of ${timeout}ms excceed.`))
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
  })
}
