import axios from '../../src/index'

const getA = () => axios.get('/more/A')
const getB = () => axios.get('/more/B')
axios.all([getA(), getB()]).then(
  axios.spread((resA, resB) => {
    console.log(resA.data)
    console.log(resB.data)
  })
)
axios.all([getA(), getB()]).then(([resA, resB]) => {
  console.log(resA.data)
  console.log(resB.data)
})

const fakeConfig = {
  baseURL: 'https://www.baidu.com/',
  url: '/user/12345',
  params: { idClient: 1, idTest: 2, testString: 'thisIsATest' }
}
console.log(axios.getUri(fakeConfig))
