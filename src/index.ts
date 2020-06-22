import { AxiosRequestConfig, AxiosPromise } from './types'
import xhr from './xhr'
import { buildUrl } from './helpers/url'
import { transformRequest } from './helpers/data'
import { processHeaders } from './helpers/headers'

const transformUrl = (config: AxiosRequestConfig): string => {
  const { url, params } = config
  return buildUrl(url, params)
}

const transfromHeaders = (config: AxiosRequestConfig): any => {
  const { headers = {}, data } = config
  return processHeaders(headers, data)
}

const transformRequestData = (config: AxiosRequestConfig): any => {
  return transformRequest(config.data)
}

const processConfig = (config: AxiosRequestConfig): void => {
  config.url = transformUrl(config)
  // 处理 headers 一定要在 data 之前
  // 因为 transformRequestData 处理之后，data 有可能会被转成字符串
  config.headers = transfromHeaders(config)
  config.data = transformRequestData(config)
}

export default (config: AxiosRequestConfig): AxiosPromise => {
  processConfig(config)
  return xhr(config)
}
