import { deepMerge, isPlainObject } from '../helpers/utils'
import { AxiosRequestConfig } from '../types'

export default function mergeConfig(
  defaultsConfig: AxiosRequestConfig,
  config2?: AxiosRequestConfig
): AxiosRequestConfig {
  if (!config2) config2 = {}

  const config = Object.create(null)

  for (let key in config2) {
    mergeField(key)
  }

  for (let key in defaultsConfig) {
    !config2[key] && mergeField(key)
  }

  function mergeField(key: string): void {
    const _merge = mergeFor[key] || defaultMerge
    config[key] = _merge(defaultsConfig[key], config2![key])
  }

  return config
}

const mergeFor: { [key in keyof AxiosRequestConfig]: any } = {}
  // TODO: auth 是否应该放在 headers 所在的数组
;['url', 'params', 'data', 'auth'].map(key => (mergeFor[key] = onlyFromConfig2))
;['headers'].map(key => (mergeFor[key] = deepMergeBoth))

function onlyFromConfig2(value1: any, value2: any) {
  if (typeof value2 !== 'undefined') {
    return value2
  }
}

function deepMergeBoth(value1: any, value2: any): any {
  if (isPlainObject(value2)) {
    return deepMerge(value1, value2)
  } else if (typeof value2 !== 'undefined') {
    return value2
  } else if (isPlainObject(value1)) {
    return deepMerge(value1)
  } else {
    return value1
  }
}

function defaultMerge(value1: any, value2: any): any {
  return typeof value2 !== 'undefined' ? value2 : value1
}
