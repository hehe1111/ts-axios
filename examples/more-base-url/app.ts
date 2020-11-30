import axios from '../../src/index'

const baseURL = 'https://img.mukewang.com/'
const filename = '5cc01a7b0001a33718720632.jpg'

const instance = axios.create({ baseURL })

instance.get(filename)

instance.get(`${baseURL}${filename}`)
