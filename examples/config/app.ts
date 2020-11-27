import axios, { AxiosTransformer } from '../../src/index'
import qs from 'qs'

axios.defaults.headers.common['test2'] = 123

axios({
  url: '/config/post',
  method: 'post',
  data: qs.stringify({ a: 1 }),
  headers: { test: '321' }
}).then(res => console.log(res.data))

axios({
  transformRequest: [
    data => qs.stringify(data), // 字符串化请求 data            （2）
    ...(axios.defaults.transformRequest as AxiosTransformer[])
  ],
  transformResponse: [
    ...(axios.defaults.transformResponse as AxiosTransformer[]),
    data => {
      if (typeof data === 'object') data.b = 2 // 处理响应 data （3）
      return data
    }
  ],
  url: '/config/post',
  method: 'post',
  data: { a: 1 } // JSON 对象                                   （1）
}).then(res => console.log(res.data))

const instance = axios.create({
  transformRequest: [
    data => qs.stringify(data),
    ...(axios.defaults.transformRequest as AxiosTransformer[])
  ],
  transformResponse: [
    ...(axios.defaults.transformResponse as AxiosTransformer[]),
    function(data) {
      if (typeof data === 'object') data.b = 3
      return data
    }
  ]
})
instance({
  url: '/config/post',
  method: 'post',
  data: { a: 1 }
}).then(res => console.log(res.data))
