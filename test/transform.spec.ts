import axios, { AxiosResponse, AxiosTransformer } from '../src/index'
import { getAjaxRequest } from './utils/index'

const data = { foo: 'bar' }

describe('src/core/transform.ts', () => {
  beforeEach(() => jasmine.Ajax.install())

  afterEach(() => jasmine.Ajax.uninstall())

  test('should transform JSON to string', () => {
    axios.post('/foo', data)

    return getAjaxRequest().then(request => {
      expect(request.params).toBe(JSON.stringify(data))
    })
  })

  xtest('should transform string to JSON', done => {
    let response: AxiosResponse

    axios('/foo').then(_response => (response = _response))

    getAjaxRequest().then(request => {
      request.respondWith({ status: 200, responseText: JSON.stringify(data) })

      setTimeout(() => {
        expect(typeof response.data).toBe('object')
        expect(response.data.foo).toBe('bar')
        done()
      }, 100)
    })
  })
  test('should transform string to JSON', done => {
    axios('/foo').then((response: AxiosResponse) => {
      expect(typeof response.data).toBe('object')
      expect(response.data.foo).toBe('bar')
      done()
    })

    getAjaxRequest().then(request => {
      request.respondWith({ status: 200, responseText: JSON.stringify(data) })
    })
  })

  test('should override default transform', () => {
    axios.post('/foo', data, {
      transformRequest(data) {
        return data
      }
    })

    return getAjaxRequest().then(request => {
      expect(request.params).toEqual(data)
    })
  })

  test('should allow an Array of transformers', () => {
    axios.post('/foo', data, {
      transformRequest: (axios.defaults.transformRequest as AxiosTransformer[]).concat(data => {
        return data.replace('bar', 'baz')
      })
    })

    return getAjaxRequest().then(request => {
      expect(request.params).toBe('{"foo":"baz"}')
    })
  })

  test('should allowing mutating headers', () => {
    const token = Math.floor(Math.random() * Math.pow(2, 64)).toString(36)

    axios('/foo', {
      transformRequest: (data, headers) => {
        headers['X-Authorization'] = token
        return data
      }
    })

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders['X-Authorization']).toEqual(token)
    })
  })
})
