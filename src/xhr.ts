import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types'

export default (config: AxiosRequestConfig): AxiosPromise => {
  return new Promise(resolve => {
    const { url, method = 'get', data, headers, responseType } = config
    const xhr = new XMLHttpRequest()
    if (responseType) {
      xhr.responseType = responseType
    }

    xhr.open(method.toUpperCase(), url)

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) {
        return
      }

      const responseHeaders = xhr.getAllResponseHeaders()
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
