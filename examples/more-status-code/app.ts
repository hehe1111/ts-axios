import axios, { AxiosError } from '../../src/index'

axios
  .get('/more/304')
  .then(res => console.log(res))
  .catch((error: AxiosError) => console.warn('正常 304', error.message))

axios
  .get('/more/304', {
    validateStatus(status) {
      return status >= 200 && status < 400
    }
  })
  .then(res => console.log(res))
  .catch((error: AxiosError) => console.warn('自定义 304', error.message))
