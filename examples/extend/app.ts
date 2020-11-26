import axios from '../../src/index'

// 本质上就是在调用 axios.request(config)
axios({
  url: '/extend/post',
  method: 'post',
  data: {
    msg: 'hi'
  }
})

axios.request({
  url: '/extend/post',
  method: 'post',
  data: {
    msg: 'hello'
  }
})

// 以下调用本质上都是在调用 axios.request(config)
axios.get('/extend/get').then(res => console.log(res))
axios.delete('/extend/delete').then(res => console.log(res))
axios.options('/extend/options').then(res => console.log(res))
axios.head('/extend/head').then(res => console.log(res))

axios.post('/extend/post', { msg: 'post' }).then(res => console.dir(res))
axios.put('/extend/put', { msg: 'put' }).then(res => console.dir(res))
axios.patch('/extend/patch', { msg: 'patch' }).then(res => console.dir(res))

// 重载
axios({
  url: '/extend/post',
  method: 'post',
  data: {
    msg: 'override 1'
  }
})
axios('/extend/post', {
  method: 'post',
  data: {
    msg: 'override 2'
  }
})

// 响应数据支持泛型
interface ResponseData<T = any> {
  result: T
}

interface User {
  name: string
  age: number
}

function getUser<T>() {
  return axios<ResponseData<T>>('/extend/user')
    .then(res => res.data)
    .catch(err => console.error(err))
}

async function test() {
  const user = await getUser<User>()
  console.log(user)
  if (user) {
    console.log(user.result.name)
  }
}

test()
