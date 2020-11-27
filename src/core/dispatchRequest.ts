import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildUrl } from '../helpers/url'
import { transformRequest, transformData } from '../helpers/data'
import { processHeaders } from '../helpers/headers'
import flattenHeaders from '../helpers/flatternHeaders'

const transformUrl = (config: AxiosRequestConfig): string => {
  const { url, params } = config
  return buildUrl(url!, params)
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
  config.headers = flattenHeaders(config.headers, config.method!)
}

const transformResponseData = (res: AxiosResponse): AxiosResponse => {
  res.data = transformData(res.data)
  return res
}

export default (config: AxiosRequestConfig): AxiosPromise => {
  processConfig(config)
  return xhr(config).then(res => transformResponseData(res))
}
