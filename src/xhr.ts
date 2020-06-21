import { AxiosRequestConfig } from './types'

export default (config: AxiosRequestConfig): void => {
  const { url, method = 'get', data } = config
  const xhr = new XMLHttpRequest()
  xhr.open(method.toUpperCase(), url)
  xhr.send(data)
}
