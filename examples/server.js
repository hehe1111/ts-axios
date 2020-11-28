const express = require('express')
const bodyParser = require('body-parser')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackConfig = require('./webpack.config')

const app = express()
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

app.use(express.static(__dirname))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const router = express.Router()

registerSimpleRoutes()
registerBaseRoutes()
registerErrorRoutes()
registerExtendRoutes()
registerInterceptorRoutes()
registerConfigRoutes()
registerCancelRoutes()

app.use(router)

const port = process.env.PORT || 3000
module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})

/* 工具函数：注册路由 */
function registerSimpleRoutes() {
  router.get('/simple/get', function(req, res) {
    res.json({
      msg: 'hello world'
    })
  })
}

function registerBaseRoutes() {
  router.get('/base/get', function(req, res) {
    res.json(req.query)
  })

  router.post('/base/post', function(req, res) {
    res.json(req.body)
  })

  router.post('/base/buffer', function(req, res) {
    let msg = []
    req.on('data', chunk => {
      if (chunk) {
        msg.push(chunk)
      }
    })
    req.on('end', () => {
      const buffer = Buffer.concat(msg)
      res.json(buffer.toJSON())
    })
  })
}

function registerErrorRoutes() {
  router.get('/error/get', function(req, res) {
    if (Math.random() > 0.5) {
      res.json({
        msg: 'hello world'
      })
    } else {
      res.status(500)
      res.end()
    }
  })

  router.get('/error/timeout', function(req, res) {
    setTimeout(() => {
      res.json({
        msg: 'hello world'
      })
    }, 3000)
  })
}

function registerExtendRoutes() {
  router.get('/extend/get', function(req, res) {
    res.json(req.path)
  })

  router.delete('/extend/delete', function(req, res) {
    res.json(req.path)
  })

  router.options('/extend/options', function(req, res) {
    res.json(req.path)
  })

  router.head('/extend/head', function(req, res) {
    // 即使返回 req.path 作为响应数据，客户端也不会接收到。因为 head 请求没有响应体
    // res.json(req.path)
    res.end()
  })

  router.post('/extend/post', function(req, res) {
    res.json(req.body)
  })

  router.put('/extend/put', function(req, res) {
    res.json(req.body)
  })

  router.patch('/extend/patch', function(req, res) {
    res.json(req.body)
  })

  router.get('/extend/user', function(req, res) {
    res.json({
      result: {
        name: 'Jack',
        age: 18
      }
    })
  })
}

function registerInterceptorRoutes() {
  router.get('/interceptor/get', function(req, res) {
    res.end(req.path)
  })
}

function registerConfigRoutes() {
  router.post('/config/post', function(req, res) {
    res.json(req.body)
  })
}

function registerCancelRoutes() {
  router.get('/cancel/get', function(req, res) {
    res.end(req.path)
  })
  router.post('/cancel/post', function(req, res) {
    res.json(req.body)
  })
}
