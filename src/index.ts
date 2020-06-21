import { AxiosRequestConfig } from './types'
import xhr from './xhr'
import { buildUrl } from './helpers/url'

const transformUrl = (config: AxiosRequestConfig) => {
  const { url, params } = config
  config.url = buildUrl(url, params)
}

const processConfig = (config: AxiosRequestConfig) => {
  transformUrl(config)
}

export default (config: AxiosRequestConfig): void => {
  processConfig(config)
  xhr(config)
}
