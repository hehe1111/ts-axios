import axios from '../../src/index'

// GET 请求
// axios({
//   method: 'get',
//   url: '/base/get',
//   params: {
//     foo: ['bar', 'baz']
//   }
// })

// axios({
//   method: 'get',
//   url: '/base/get',
//   params: {
//     foo: {
//       bar: 'baz'
//     }
//   }
// })

// axios({
//   method: 'get',
//   url: '/base/get',
//   params: {
//     date: new Date()
//   }
// })

// axios({
//   method: 'get',
//   url: '/base/get',
//   params: {
//     foo: '@:$, '
//   }
// })

// axios({
//   method: 'get',
//   url: '/base/get',
//   params: {
//     foo: 'bar',
//     baz: null
//   }
// })

// axios({
//   method: 'get',
//   url: '/base/get#hash',
//   params: {
//     foo: 'bar'
//   }
// })

// axios({
//   method: 'get',
//   url: '/base/get?foo=bar',
//   params: {
//     bar: 'baz'
//   }
// })

// === POST 请求 ===
// 普通对象类型的 data
axios({
  method: 'post',
  url: '/base/post',
  data: {
    a: 1,
    b: 2
  }
})

axios({
  method: 'post',
  url: '/base/post',
  headers: {
    // 单独一个 application/json 时，最后不能加分号
    // application/json; 会使服务器无法解析接收到的对象字符串
    // 需要加上编码时，才需要加分号 application/json; charset=utf-8
    'content-type': 'application/json',
    Accept: 'application/json, text/plain, */*',
    CustomHeader: '======== This is a custom header ========'
  },
  data: {
    a: 1,
    b: 2
  }
})

// 当 data 是某些类型如 URLSearchParams 的时候
// 浏览器会**自动**为请求 header 加上合适的 Content - Type
const paramsString = 'q=URLUtils.searchParams&topic=api'
const searchParams = new URLSearchParams(paramsString)
axios({
  method: 'post',
  url: '/base/post',
  data: searchParams
})

// Buffer 类型的 data
axios({
  method: 'post',
  url: '/base/buffer',
  data: new Int32Array([21, 31])
})
