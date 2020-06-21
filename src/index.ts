import { AxiosRequestConfig } from './types'
import xhr from './xhr'

export default (config: AxiosRequestConfig): void => {
  xhr(config)
}
