const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path')
const multipart = require('connect-multiparty')
const atob = require('atob')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackConfig = require('./webpack.config')

const app = express()

// 静态资源服务器相关
const compiler = webpack(WebpackConfig)
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: '/__build__/',
    stats: {
      colors: true,
      chunks: false
    }
  })
)
app.use(webpackHotMiddleware(compiler))
app.use(
  express.static(__dirname, {
    setHeaders(res) {
      // 在访问页面的时候，服务端通过 set-cookie 往客户端种了 key 为 XSRF-TOKEN-D，值为 1234abc 的 cookie，作为 xsrf 的 token 值
      res.cookie('XSRF-TOKEN-D', '1234abc')
    }
  })
)

// api 服务器相关
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
// 处理上传文件
app.use(
  multipart({
    uploadDir: path.resolve(__dirname, 'uploaded-file')
  })
)

const router = express.Router()
registerSimpleRoutes()
registerBaseRoutes()
registerErrorRoutes()
registerExtendRoutes()
registerInterceptorRoutes()
registerConfigRoutes()
registerCancelRoutes()
registerMoreRoutes()
app.use(router)

const port = process.env.PORT || 3000
module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})

/* === 工具函数：注册路由 === */

function registerSimpleRoutes() {
  router.get('/simple/get', (req, res) => res.json({ msg: 'hello world' }))
}

function registerBaseRoutes() {
  router.get('/base/get', (req, res) => res.json(req.query))
  router.post('/base/post', (req, res) => res.json(req.body))
  router.post('/base/buffer', function(req, res) {
    let msg = []
    req.on('data', chunk => chunk && msg.push(chunk))
    req.on('end', () => {
      const buffer = Buffer.concat(msg)
      res.json(buffer.toJSON())
    })
  })
}

function registerErrorRoutes() {
  router.get('/error/get', function(req, res) {
    if (Math.random() > 0.5) {
      res.json({ msg: 'hello world' })
    } else {
      res.status(500)
      res.end()
    }
  })
  router.get('/error/timeout', (req, res) =>
    setTimeout(() => res.json({ msg: 'hello world' }), 3000)
  )
}

function registerExtendRoutes() {
  router.get('/extend/get', (req, res) => res.json(req.path))
  router.delete('/extend/delete', (req, res) => res.json(req.path))
  router.options('/extend/options', (req, res) => res.json(req.path))
  // 即使返回 req.path 作为响应数据，客户端也不会接收到。因为 head 请求没有响应体
  // res.json(req.path)
  router.head('/extend/head', (req, res) => res.end())
  router.post('/extend/post', (req, res) => res.json(req.body))
  router.put('/extend/put', (req, res) => res.json(req.body))
  router.patch('/extend/patch', (req, res) => res.json(req.body))
  router.get('/extend/user', (req, res) => res.json({ result: { name: 'Jack', age: 18 } }))
}

function registerInterceptorRoutes() {
  router.get('/interceptor/get', (req, res) => res.end(req.path))
}

function registerConfigRoutes() {
  router.post('/config/post', (req, res) => res.json(req.body))
}

function registerCancelRoutes() {
  router.get('/cancel/get', (req, res) => res.end(req.path))
  router.post('/cancel/post', (req, res) => res.json(req.body))
}

function registerMoreRoutes() {
  router.get('/more/get', (req, res) => res.json(req.cookies))
  router.post('/more/upload', (req, res) => {
    console.log(req.body, req.files)
    res.end('upload success!')
  })
  router.post('/more/post', (req, res) => {
    const auth = req.headers.authorization
    console.log('auth=', auth)
    const [type, credentials] = auth.split(' ')
    console.log('atob(credentials)=', atob(credentials))
    const [username, password] = atob(credentials).split(':')
    type === 'Basic' && username === 'Bob' && password === '123456'
      ? res.json(req.body)
      : res.end('UnAuthorization')
  })
  router.get('/more/304', (req, res) => {
    res.status(304)
    res.end()
  })
  router.get('/more/params-serialization', (req, res) => res.json(req.url))
  router.get('/more/A', (req, res) => res.json(req.path))
  router.get('/more/B', (req, res) => res.json(req.path))
}
