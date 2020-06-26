import axios, { AxiosError } from '../../src/index'

// 访问一个不存在的路径。会返回 404 错误
axios({
  method: 'get',
  url: '/error/get1'
})
  .then(res => {
    console.log(res)
  })
  .catch(e => {
    console.log(e)
  })

axios({
  method: 'get',
  url: '/error/get'
})
  .then(res => {
    console.log(res)
  })
  .catch(e => {
    console.log(e)
  })

setTimeout(() => {
  axios({
    method: 'get',
    url: '/error/get'
  })
    .then(res => {
      console.log(res)
    })
    .catch(e => {
      console.log(e)
    })
}, 5000)

axios({
  method: 'get',
  url: '/error/timeout',
  timeout: 2000
})
  .then(res => {
    console.log(res)
  })
  .catch((e: AxiosError) => {
    console.log('e.message=', e.message)
    console.log('e.config=', e.config)
    console.log('e.code=', e.code)
    console.log('e.request=', e.request)
    console.log('e.response=', e.response)
    console.log('e.isAxiosError=', e.isAxiosError)
  })
