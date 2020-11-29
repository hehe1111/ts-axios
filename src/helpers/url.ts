import { isDate, isPlainObject } from './utils'

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

export function buildUrl(url: string, params?: any): string {
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
      } else if (isPlainObject(_v)) {
        _v = JSON.stringify(_v)
      }
      parts.push(`${encode(k)}=${encode(_v)}`)
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

interface URLOrigin {
  protocol: string
  host: string
}

const currentOrigin = resolveURL(window.location.href)

export function isURLSameOrigin(requestURL: string): boolean {
  const parsedOrigin = resolveURL(requestURL)
  return (
    parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host
  )
}

function resolveURL(url: string): URLOrigin {
  // [Javascript: document.createElement('') & delete DOMElement](https://stackoverflow.com/a/1847289/14449377)
  // 创建一个 a 标签的 DOM，然后设置 href 属性为传入的 url，然后可以获取该 DOM 的 protocol、host
  let urlParsingNode: HTMLAnchorElement | null = document.createElement('a')
  urlParsingNode.setAttribute('href', url)
  const { protocol, host } = urlParsingNode
  urlParsingNode = null

  return { protocol, host }
}
