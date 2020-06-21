import { isDate, isObject } from './utils'

function encode(param: string): string {
  return encodeURIComponent(param)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildUrl(url: string, params?: any) {
  if (!params) {
    return url
  }

  const parts: string[] = []

  Object.keys(params).map(k => {
    const v = params[k]
    if (v === null || v === undefined) {
      return
    }
    let values: any[] = []
    if (Array.isArray(v)) {
      values = v
      k += '[]'
    } else {
      values = [v]
    }
    values.map(_v => {
      if (isDate(_v)) {
        _v = _v.toISOString()
      } else if (isObject(_v)) {
        _v = JSON.stringify(_v)
      }
      parts.push(`${encode(k)}=${encode(_v)}}`)
    })
  })

  const serializeParams = parts.join('&')
  if (serializeParams) {
    const hashIndex = url.indexOf('#')
    if (hashIndex !== -1) {
      url = url.slice(0, hashIndex)
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializeParams
  }

  return url
}
