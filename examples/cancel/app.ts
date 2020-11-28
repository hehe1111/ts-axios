import axios, { Canceler } from '../../src/index'

const CancelToken = axios.CancelToken
const source = CancelToken.source()
axios.get('/cancel/get', { cancelToken: source.token }).catch(function(e) {
  axios.isCancel(e) && console.warn('1 被取消了', e.message)
})
setTimeout(() => {
  source.cancel('第一个 axios 实例被取消了')
  axios.post('/cancel/post', { a: 1 }, { cancelToken: source.token }).catch(function(e) {
    axios.isCancel(e) && console.warn(e.message, '2 因此没有发出去')
  })
}, 100)

let cancel: Canceler
axios
  .get('/cancel/get', { cancelToken: new CancelToken(c => (cancel = c)) })
  .then(response => console.log('3 成功收到响应', response.data))
  .catch(function(e) {
    axios.isCancel(e) && console.warn('3 因此没有发出去')
  })
const isCanceled = Math.random() < 0.5
console.warn(`响应前${isCanceled ? '' : '没有'}取消第二个 axios 实例`)
setTimeout(cancel, isCanceled ? 5 : 200)
