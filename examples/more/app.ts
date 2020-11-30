import axios from '../../src/index'

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
