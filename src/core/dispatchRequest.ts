import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildUrl } from '../helpers/url'
import flattenHeaders from '../helpers/flatternHeaders'
import transform from './transform'

const transformUrl = (config: AxiosRequestConfig): string => {
  const { url, params } = config
  return buildUrl(url!, params)
}

const processConfig = (config: AxiosRequestConfig): void => {
  config.url = transformUrl(config)
  config.data = transform(config.data, config.headers, config.transformRequest)
  config.headers = flattenHeaders(config.headers, config.method!)
}

const _transformResponseData = (res: AxiosResponse): AxiosResponse => {
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}

export default (config: AxiosRequestConfig): AxiosPromise => {
  throwIfCancellationRequested(config)
  processConfig(config)
  return xhr(config).then(res => _transformResponseData(res))
}

function throwIfCancellationRequested(config: AxiosRequestConfig): void {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}
