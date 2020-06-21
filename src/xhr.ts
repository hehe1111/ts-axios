import { AxiosRequestConfig } from './types'

export default (config: AxiosRequestConfig): void => {
  const { url, method = 'get', data, headers } = config
  const xhr = new XMLHttpRequest()

  xhr.open(method.toUpperCase(), url)

  // 需要在执行过 open 方法后，才可以去处理 headers
  Object.keys(headers).map(name => {
    if (data === null && name.toLocaleLowerCase() === 'content-type') {
      delete headers[name]
    } else {
      xhr.setRequestHeader(name, headers[name])
    }
  })

  xhr.send(data)
}
