import axios, { AxiosResponse, AxiosError } from '../src/index'
import { getAjaxRequest } from './utils'

describe('index', () => {
  beforeEach(() => jasmine.Ajax.install())

  afterEach(() => jasmine.Ajax.uninstall())

  test('should treat single string arg as url', done => {
    axios('/foo')

    getAjaxRequest().then(request => {
      // 如果要能看见这里的输出，必须调用 done()
      // 如果不用查看输出，则不需要调用 done() ，也就不用在 test 的第二个函数去获取 done
      // console.log(request)
      expect(request.url).toBe('/foo')
      expect(request.method).toBe('GET')
      done()
    })
  })

  test('should treat method value as lowercase string', done => {
    axios({ url: '/foo', method: 'POST' }).then(response => {
      expect(response.config.method).toBe('post')
      done()
    })

    // 伪造一个假的响应。如果删掉下面这一行，或者 status < 200 或 status > 300，都会报错
    getAjaxRequest().then(request => request.respondWith({ status: 200 }))
  })

  test('should reject on network errors', done => {
    // 该测试会导致终端输出一个 console.error，但是不影响测试结果

    const resolveSpy = jest.fn((response: AxiosResponse) => response)
    const rejectSpy = jest.fn((error: AxiosError) => error)

    jasmine.Ajax.uninstall()

    axios('/foo')
      .then(resolveSpy)
      .catch(rejectSpy)
      .then(next)

    function next(reason: AxiosResponse | AxiosError) {
      expect(resolveSpy).not.toHaveBeenCalled()
      expect(rejectSpy).toHaveBeenCalled()
      expect(reason instanceof Error).toBeTruthy()
      expect((reason as AxiosError).message).toBe('Network Error.')
      // expect.any(XMLHttpRequest) 表示匹配任意由 constructor 创建的对象实例
      expect(reason.request).toEqual(expect.any(XMLHttpRequest))

      jasmine.Ajax.install()

      done()
    }
  })

  xtest('should reject when request timeout', done => {
    let error: AxiosError

    axios('/foo', { timeout: 2000, method: 'post' }).catch(_error => {
      error = _error
    })

    getAjaxRequest().then(request => {
      // @ts-ignore
      request.eventBus.trigger('timeout')

      setTimeout(() => {
        expect(error instanceof Error).toBeTruthy()
        expect(error.message).toBe('Timeout of 2000ms exceeded.')
        done()
      }, 100)
    })
  })
  test('should reject when request timeout', done => {
    axios('/foo', { timeout: 2000, method: 'post' }).catch((error: AxiosError) => {
      expect(error instanceof Error).toBeTruthy()
      expect(error.message).toBe('Timeout of 2000ms exceeded.')
      done()
    })

    // @ts-ignore
    getAjaxRequest().then(request => request.eventBus.trigger('timeout'))
  })

  test('should reject when validateStatus returns false', done => {
    const resolveSpy = jest.fn((response: AxiosResponse) => response)
    const rejectSpy = jest.fn((error: AxiosError) => error)

    axios('/foo', {
      validateStatus(status) {
        return status !== 500
      }
    })
      .then(resolveSpy)
      .catch(rejectSpy)
      .then(next)

    getAjaxRequest().then(request => request.respondWith({ status: 500 }))

    function next(reason: AxiosError | AxiosResponse) {
      expect(resolveSpy).not.toHaveBeenCalled()
      expect(rejectSpy).toHaveBeenCalled()
      expect(reason instanceof Error).toBeTruthy()
      expect((reason as AxiosError).message).toBe('Request failed with status code 500')
      expect((reason as AxiosError).response!.status).toBe(500)

      done()
    }
  })

  test('should resolve when validateStatus returns true', done => {
    const resolveSpy = jest.fn((response: AxiosResponse) => response)
    const rejectSpy = jest.fn((error: AxiosError) => error)

    axios('/foo', {
      validateStatus(status) {
        return status === 500
      }
    })
      .then(resolveSpy)
      .catch(rejectSpy)
      .then(next)

    getAjaxRequest().then(request => request.respondWith({ status: 500 }))

    function next(res: AxiosResponse | AxiosError) {
      expect(resolveSpy).toHaveBeenCalled()
      expect(rejectSpy).not.toHaveBeenCalled()
      expect(res.config.url).toBe('/foo')

      done()
    }
  })

  xtest('should return JSON when resolved', done => {
    let response: AxiosResponse

    axios('/api/account/signup', {
      auth: { username: '', password: '' },
      method: 'post',
      headers: { Accept: 'application/json' }
    }).then(_response => {
      response = _response
      // console.log('=========')
      // console.log(response.data) // { a: 1 }
      // console.log('=========')
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{"a": 1}'
      })

      setTimeout(() => {
        expect(response.data).toEqual({ a: 1 })
        done()
      }, 100)
    })
  })
  test('should return JSON when resolved', done => {
    axios('/api/account/signup', {
      auth: { username: '', password: '' },
      method: 'post',
      headers: { Accept: 'application/json' }
    }).then((response: AxiosResponse) => {
      expect(response.data).toEqual({ a: 1 })
      done()
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{"a": 1}'
      })
    })
  })

  xtest('should return JSON when rejecting', done => {
    let response: AxiosResponse

    axios('/api/account/signup', {
      auth: { username: '', password: '' },
      method: 'post',
      headers: { Accept: 'application/json' }
    }).catch(error => (response = error.response))

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 400,
        statusText: 'Bad Request',
        responseText: '{"error": "BAD USERNAME", "code": 1}'
      })

      setTimeout(() => {
        expect(typeof response.data).toBe('object')
        expect(response.data.error).toBe('BAD USERNAME')
        expect(response.data.code).toBe(1)
        done()
      }, 100)
    })
  })
  test('should return JSON when rejecting', done => {
    axios('/api/account/signup', {
      auth: { username: '', password: '' },
      method: 'post',
      headers: { Accept: 'application/json' }
    }).catch(error => {
      const response: AxiosResponse = error.response
      expect(typeof response.data).toBe('object')
      expect(response.data.error).toBe('BAD USERNAME')
      expect(response.data.code).toBe(1)
      done()
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 400,
        statusText: 'Bad Request',
        responseText: '{"error": "BAD USERNAME", "code": 1}'
      })
    })
  })

  xtest('should supply correct response', done => {
    let response: AxiosResponse

    axios.post('/foo').then(res => (response = res))

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{"foo": "bar"}',
        responseHeaders: { 'Content-Type': 'application/json' }
      })

      setTimeout(() => {
        expect(response.status).toBe(200)
        expect(response.statusText).toBe('OK')
        expect(response.data.foo).toBe('bar')
        expect(response.headers['content-type']).toBe('application/json')
        done()
      }, 100)
    })
  })
  test('should supply correct response', done => {
    axios.post('/foo').then((response: AxiosResponse) => {
      expect(response.status).toBe(200)
      expect(response.statusText).toBe('OK')
      expect(response.data.foo).toBe('bar')
      expect(response.headers['content-type']).toBe('application/json')
      done()
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{"foo": "bar"}',
        responseHeaders: { 'Content-Type': 'application/json' }
      })
    })
  })

  test('should allow overriding Content-Type header case-insensitive', done => {
    axios.post('/foo', { prop: 'value' }, { headers: { 'content-type': 'application/json' } })

    getAjaxRequest().then(request => {
      expect(request.requestHeaders['Content-Type']).toBe('application/json')
      done()
    })
  })
})
