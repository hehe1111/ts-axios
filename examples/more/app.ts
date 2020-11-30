import qs from 'qs'
import axios, { AxiosError } from '../../src/index'

/* === withCredential == */

document.cookie = 'a=b'
axios.get('/more/get').then(res => console.log('同域', res.data))
axios
  .post('http://localhost:3001/more/server2', {})
  .then(res => console.log('跨域 没有配置 withCredentials', res.data))
axios
  .post('http://localhost:3001/more/server2', {}, { withCredentials: true })
  .then(res => console.log('跨域 配置 withCredentials: true', res.data))
// 检验方法二：
// post 请求之前会发一个预检请求 OPTIONS
// 打开控制台 -> Network 面板 -> 点开 server2 OPTIONS 请求，可以看到 Request Headers 部分是没有 cookie 的

/* === XSRF === */

const instance = axios.create({
  xsrfCookieName: 'XSRF-TOKEN-D',
  xsrfHeaderName: 'X-XSRF-TOKEN-D'
})
instance.get('/more/get').then(res => console.log(res.config.headers))

/* === HTTP 授权 === */

axios
  .post('/more/post', { a: 1 }, { auth: { username: 'Bob', password: '123456' } })
  .then(res => console.log(res))
axios
  .post('/more/post', { a: 1 }, { auth: { username: 'Bob', password: '1234567' } })
  .then(res => console.log(res))

/* === 自定义合法状态码 === */

axios
  .get('/more/304')
  .then(res => console.log(res))
  .catch((e: AxiosError) => console.warn('正常 304', e.message))
axios
  .get('/more/304', {
    validateStatus(status) {
      return status >= 200 && status < 400
    }
  })
  .then(res => console.log(res))
  .catch((e: AxiosError) => console.warn('自定义 304', e.message))

/* === 自定义参数序列化 === */

// 满足请求的 params 参数是 URLSearchParams 对象类型
axios
  .get('/more/params-serialization', { params: new URLSearchParams('a=b&c=d') })
  .then(res => console.log(res))

// 没有对 [] 转义
axios
  .get('/more/params-serialization', { params: { a: 1, b: 2, c: ['a', 'b', 'c'] } })
  .then(res => console.log(res))

// 对 [] 转义
const instance2 = axios.create({
  paramsSerializer(params) {
    return qs.stringify(params, { arrayFormat: 'brackets' })
  }
})
instance2
  .get('/more/params-serialization', { params: { a: 1, b: 2, c: ['a', 'b', 'c'] } })
  .then(res => console.log(res))
