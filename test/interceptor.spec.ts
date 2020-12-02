import axios, { AxiosRequestConfig, AxiosResponse } from '../src/index'
import { getAjaxRequest } from './utils/index'

describe('interceptors', () => {
  beforeEach(() => jasmine.Ajax.install())

  afterEach(() => jasmine.Ajax.uninstall())

  test('should add a request interceptor', () => {
    const instance = axios.create()

    instance.interceptors.request.use((config: AxiosRequestConfig) => {
      config.headers.test = 'added by interceptor'
      return config
    })

    instance('/foo')

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders.test).toBe('added by interceptor')
    })
  })

  test('should add a request interceptor that returns a new config object', () => {
    const instance = axios.create()

    instance.interceptors.request.use(() => ({ url: '/bar', method: 'post' }))

    instance('/foo')

    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/bar')
      expect(request.method).toBe('POST')
    })
  })

  test('should add a request interceptor that returns a promise', done => {
    const instance = axios.create()

    instance.interceptors.request.use((config: AxiosRequestConfig) => {
      return new Promise(resolve => {
        setTimeout(() => {
          config.headers.async = 'promise'
          resolve(config)
        }, 10)
      })
    })

    instance('/foo')

    setTimeout(() => {
      getAjaxRequest().then(request => {
        expect(request.requestHeaders.async).toBe('promise')
        done()
      })
    }, 100)
  })

  test('should add multiple request interceptors', () => {
    const instance = axios.create()

    instance.interceptors.request.use(config => {
      config.headers.test += '1'
      return config
    })
    instance.interceptors.request.use(config => {
      config.headers.test += '2'
      return config
    })
    instance.interceptors.request.use(config => {
      config.headers.test = '3'
      return config
    })

    instance('/foo')

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders.test).toBe('321')
    })
  })

  // xtest('should add a response interceptor', done => {
  //   let response: AxiosResponse
  //   const instance = axios.create()

  //   instance.interceptors.response.use(response => {
  //     response.data = response.data + ' - modified by interceptor'
  //     return response
  //   })

  //   instance('/foo').then(_response => (response = _response))

  //   getAjaxRequest().then(request => {
  //     request.respondWith({ status: 200, responseText: 'OK' })

  //     setTimeout(() => {
  //       expect(response.data).toBe('OK - modified by interceptor')
  //       done()
  //     }, 100)
  //   })
  // })
  test('should add a response interceptor', done => {
    const instance = axios.create()

    instance.interceptors.response.use((response: AxiosResponse) => {
      response.data = response.data + ' - modified by interceptor'
      return response
    })

    instance('/foo').then(_response => {
      expect(_response.data).toBe('OK - modified by interceptor')
      done()
    })

    getAjaxRequest().then(request => {
      request.respondWith({ status: 200, responseText: 'OK' })
    })
  })

  // xtest('should add a response interceptor that returns a new data object', done => {
  //   let response: AxiosResponse
  //   const instance = axios.create()

  //   instance.interceptors.response.use(_response => {
  //     return {
  //       data: 'stuff',
  //       headers: null,
  //       status: 500,
  //       statusText: 'ERR',
  //       request: _response.request,
  //       config: {}
  //     }
  //   })

  //   instance('/foo').then(_response => (response = _response))

  //   getAjaxRequest().then(request => {
  //     request.respondWith({ status: 200, responseText: 'OK' })

  //     setTimeout(() => {
  //       expect(response.data).toBe('stuff')
  //       expect(response.headers).toBeNull()
  //       expect(response.status).toBe(500)
  //       expect(response.statusText).toBe('ERR')
  //       expect(response.request).toEqual(expect.any(XMLHttpRequest))
  //       expect(response.config).toEqual({})
  //       done()
  //     }, 100)
  //   })
  // })
  test('should add a response interceptor that returns a new data object', done => {
    const instance = axios.create()

    instance.interceptors.response.use(_response => {
      return {
        data: 'stuff',
        headers: null,
        status: 500,
        statusText: 'ERR',
        request: _response.request,
        config: {}
      }
    })

    instance('/foo').then((response: AxiosResponse) => {
      expect(response.data).toBe('stuff')
      expect(response.headers).toBeNull()
      expect(response.status).toBe(500)
      expect(response.statusText).toBe('ERR')
      expect(response.request).toEqual(expect.any(XMLHttpRequest))
      expect(response.config).toEqual({})
      done()
    })

    getAjaxRequest().then(request => {
      request.respondWith({ status: 200, responseText: 'OK' })
    })
  })

  // xtest('should add a response interceptor that returns a promise', done => {
  //   let response: AxiosResponse
  //   const instance = axios.create()

  //   instance.interceptors.response.use(_response => {
  //     return new Promise(resolve => {
  //       // do something async
  //       setTimeout(() => {
  //         _response.data = 'you have been promised!'
  //         resolve(_response)
  //       }, 10)
  //     })
  //   })

  //   instance('/foo').then(_response => (response = _response))

  //   getAjaxRequest().then(request => {
  //     request.respondWith({ status: 200, responseText: 'OK' })

  //     setTimeout(() => {
  //       expect(response.data).toBe('you have been promised!')
  //       done()
  //     }, 100)
  //   })
  // })
  test('should add a response interceptor that returns a promise', done => {
    const instance = axios.create()
    instance.interceptors.response.use(_response => {
      return new Promise(resolve => {
        // do something async
        setTimeout(() => {
          _response.data = 'you have been promised!'
          resolve(_response)
        }, 10)
      })
    })

    instance('/foo').then((response: AxiosResponse) => {
      expect(response.data).toBe('you have been promised!')
      done()
    })

    getAjaxRequest().then(request => {
      request.respondWith({ status: 200, responseText: 'OK' })
    })
  })

  // xtest('should add multiple response interceptors', done => {
  //   let response: AxiosResponse
  //   const instance = axios.create()

  //   instance.interceptors.response.use(_response => {
  //     _response.data = _response.data + '1'
  //     return _response
  //   })
  //   instance.interceptors.response.use(_response => {
  //     _response.data = _response.data + '2'
  //     return _response
  //   })
  //   instance.interceptors.response.use(_response => {
  //     _response.data = _response.data + '3'
  //     return _response
  //   })

  //   instance('/foo').then(_response => (response = _response))

  //   getAjaxRequest().then(request => {
  //     request.respondWith({ status: 200, responseText: 'OK' })

  //     setTimeout(() => {
  //       expect(response.data).toBe('OK123')
  //       done()
  //     }, 100)
  //   })
  // })
  test('should add multiple response interceptors', done => {
    const instance = axios.create()

    instance.interceptors.response.use(_response => {
      _response.data = _response.data + '1'
      return _response
    })
    instance.interceptors.response.use(_response => {
      _response.data = _response.data + '2'
      return _response
    })
    instance.interceptors.response.use(_response => {
      _response.data = _response.data + '3'
      return _response
    })

    instance('/foo').then((response: AxiosResponse) => {
      expect(response.data).toBe('OK123')
      done()
    })

    getAjaxRequest().then(request => {
      request.respondWith({ status: 200, responseText: 'OK' })
    })
  })

  // xtest('should allow removing interceptors', done => {
  //   let response: AxiosResponse
  //   let intercept
  //   const instance = axios.create()

  //   instance.interceptors.response.use(_response => {
  //     _response.data = _response.data + '1'
  //     return _response
  //   })
  //   intercept = instance.interceptors.response.use(_response => {
  //     _response.data = _response.data + '2'
  //     return _response
  //   })
  //   instance.interceptors.response.use(_response => {
  //     _response.data = _response.data + '3'
  //     return _response
  //   })

  //   instance.interceptors.response.eject(intercept)

  //   instance('/foo').then(_response => (response = _response))

  //   getAjaxRequest().then(request => {
  //     request.respondWith({ status: 200, responseText: 'OK' })

  //     setTimeout(() => {
  //       expect(response.data).toBe('OK13')
  //       done()
  //     }, 100)
  //   })
  // })
  test('should allow removing interceptors', done => {
    let intercept: number
    const instance = axios.create()

    instance.interceptors.response.use(_response => {
      _response.data = _response.data + '1'
      return _response
    })
    intercept = instance.interceptors.response.use(_response => {
      _response.data = _response.data + '2'
      return _response
    })
    instance.interceptors.response.use(_response => {
      _response.data = _response.data + '3'
      return _response
    })

    instance.interceptors.response.eject(intercept)

    instance('/foo').then((response: AxiosResponse) => {
      expect(response.data).toBe('OK13')
      done()
    })

    getAjaxRequest().then(request => {
      request.respondWith({ status: 200, responseText: 'OK' })
    })
  })
})
