import axios, { AxiosError } from '../../src/index'

// 访问一个不存在的路径。会返回 404 错误
axios({ method: 'get', url: '/error/get1' })
  .then(response => console.log(response))
  .catch(error => console.log(error))

axios({ method: 'get', url: '/error/get' })
  .then(response => console.log(response))
  .catch(error => console.log(error))

axios({ method: 'get', url: '/error/timeout', timeout: 1234 })
  .then(response => console.log(response))
  .catch((error: AxiosError) => {
    console.log('error.message=', error.message)
    console.log('error.config=', error.config)
    console.log('error.code=', error.code)
    console.log('error.request=', error.request)
    console.log('error.response=', error.response)
    console.log('error.isAxiosError=', error.isAxiosError)
  })

axios({ method: 'get', url: '/error/timeout', timeout: 4000 })
  .then(response => console.log(response))
  .catch((error: AxiosError) => {
    console.log('error.message=', error.message)
    console.log('error.config=', error.config)
    console.log('error.code=', error.code)
    console.log('error.request=', error.request)
    console.log('error.response=', error.response)
    console.log('error.isAxiosError=', error.isAxiosError)
  })
