import { AxiosRequestConfig } from './types'

const defaults: AxiosRequestConfig = {
  method: 'get',
  timeout: 0,
  headers: {
    common: {
      Accept: 'application/json; text/plain; */*'
    }
  }
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

console.log(defaults)

export default defaults
