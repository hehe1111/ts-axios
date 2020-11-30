import axios from '../../src/index'

axios
  .post('/more/post', { a: 1 }, { auth: { username: 'Bob', password: '123456' } })
  .then(res => console.log(res))

axios
  .post('/more/post', { a: 1 }, { auth: { username: 'Bob', password: '1234567' } })
  .then(res => console.log(res))
