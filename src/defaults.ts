import { stringifyData, parseData } from './helpers/data'
import { contentTypeJson } from './helpers/headers'
import { AxiosRequestConfig } from './types'

const defaults: AxiosRequestConfig = {
  method: 'get',
  timeout: 0,
  headers: {
    common: {
      Accept: 'application/json; text/plain; */*'
    }
  },
  /* === 把对请求数据和响应数据的处理逻辑，放到默认配置中，做为默认处理逻辑 === */
  transformRequest: [
    (data: any, headers: any): any => {
      // 处理 headers 一定要在 data 之前
      // 因为 stringifyData 处理之后，data 有可能会被转成字符串
      contentTypeJson(headers, data)
      return stringifyData(data)
    }
  ],
  transformResponse: [(data: any): any => parseData(data)],
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN'
}

const methodsNoData = ['get', 'head', 'options', 'delete']
/**
 * defaults.headers = {
 *   common: {/.../},
 *   get: {},
 *   head: {},
 *   options: {},
 *   delete: {},
 * }
 */
methodsNoData.map(method => (defaults.headers[method] = {}))

const methodsWithData = ['post', 'put', 'patch']
/**
 * defaults.headers = {
 *   common: {/.../},
 *   get: {},
 *   head: {},
 *   options: {},
 *   delete: {},
 *   post: {
 *     "Content-Type": "application/x-www-form-urlencoded"
 *   },
 *   put: {
 *     "Content-Type": "application/x-www-form-urlencoded"
 *   },
 *   patch: {
 *     "Content-Type": "application/x-www-form-urlencoded"
 *   },
 * }
 */
methodsWithData.map(
  method => (defaults.headers[method] = { 'Content-Type': 'application/x-www-form-urlencoded' })
)

export default defaults
