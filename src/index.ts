import { AxiosRequestConfig } from './types'
import xhr from './xhr'
import { buildUrl } from './helpers/url'
import { transformRequest } from './helpers/data'

const transformUrl = (config: AxiosRequestConfig): string => {
  const { url, params } = config
  return buildUrl(url, params)
}

const transformRequestData = (config: AxiosRequestConfig): any => {
  return transformRequest(config.data)
}

const processConfig = (config: AxiosRequestConfig): void => {
  config.url = transformUrl(config)
  config.data = transformRequestData(config)
}

export default (config: AxiosRequestConfig): void => {
  processConfig(config)
  xhr(config)
}
