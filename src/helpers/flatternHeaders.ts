import { METHOD } from '../types/index'
import { deepMerge } from './utils'

export default function flattenHeaders(headers: any, method: METHOD): any {
  if (!headers) return headers

  headers = deepMerge(headers.common || {}, headers[method] || {}, headers)

  const methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common']
  methodsToDelete.map(method => delete headers[method])

  return headers
}
