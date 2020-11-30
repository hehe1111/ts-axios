import qs from 'qs'
import axios from '../../src/index'

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
