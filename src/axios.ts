import { AxiosInstance } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/utils'

export const createInstance = (): AxiosInstance => {
  const context = new Axios()
  // 需要进行绑定，否则调用时 instance 函数的 this 就为 undefined
  const instance = Axios.prototype.request.bind(context)
  extend(instance, context)
  return instance as AxiosInstance
}

const axios = createInstance()

export default axios
