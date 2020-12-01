import { buildUrl, isURLSameOrigin, isAbsoluteURL, combineURL } from '../../src/helpers/url'

describe('src/helpers/url.ts', () => {
  describe('buildUrl', () => {
    test('可不传查询参数', () => {
      expect(buildUrl({ url: '/foo' })).toEqual('/foo')
    })

    test('可传查询参数', () => {
      expect(buildUrl({ url: '/foo', params: { foo: 'bar' } })).toEqual('/foo?foo=bar')
    })

    test('查询参数值为 null 则忽略', () => {
      expect(buildUrl({ url: '/foo', params: { foo: 'bar', baz: null } })).toEqual('/foo?foo=bar')
      expect(buildUrl({ url: '/foo', params: { baz: null } })).toEqual('/foo')
    })

    test('支持查询参数值为数组类型', () => {
      expect(buildUrl({ url: '/foo', params: { foo: ['bar', 'baz'] } })).toEqual(
        '/foo?foo[]=bar&foo[]=baz'
      )
    })

    test('支持查询参数值为对象类型', () => {
      expect(buildUrl({ url: '/foo', params: { foo: { bar: 'baz' } } })).toEqual(
        '/foo?foo=' + encodeURI('{"bar":"baz"}')
      )
    })

    test('支持查询参数值为 Date 类型', () => {
      const date = new Date()
      expect(buildUrl({ url: '/foo', params: { date } })).toEqual('/foo?date=' + date.toISOString())
    })

    test('支持查询参数值为特殊字符串', () => {
      expect(buildUrl({ url: '/foo', params: { foo: '@:$, ' } })).toEqual('/foo?foo=@:$,+')
    })

    test('支持 url 上带有查询参数', () => {
      expect(buildUrl({ url: '/foo?foo=bar', params: { baz: 'baz' } })).toEqual(
        '/foo?foo=bar&baz=baz'
      )
    })

    test('能去掉 # 及其后面的字符串', () => {
      expect(buildUrl({ url: '/foo?foo=bar#hash', params: { baz: 'baz' } })).toEqual(
        '/foo?foo=bar&baz=baz'
      )
    })

    test('支持自定义参数序列化', () => {
      const paramsSerializer = jest.fn(() => 'foo=bar')
      const params = { foo: 'bar' }
      expect(buildUrl({ url: '/foo', params, paramsSerializer })).toBe('/foo?foo=bar')
      expect(paramsSerializer).toHaveBeenCalled()
      expect(paramsSerializer).toHaveBeenCalledWith(params)
    })

    test('支持查询参数为 URLSearchParams', () => {
      expect(buildUrl({ url: '/foo', params: new URLSearchParams('bar=baz') })).toBe('/foo?bar=baz')
    })
  })

  describe('isURLSameOrigin', () => {
    test('能正确校验是否同域', () => {
      // window.location.href: http://localhost/
      expect(isURLSameOrigin(window.location.href)).toBeTruthy()
      expect(isURLSameOrigin('https://example.com')).toBeFalsy()
    })
  })

  describe('isAbsoluteURL', () => {
    test('能正确校验 url 是否是绝对路径', () => {
      expect(isAbsoluteURL('https://example.com')).toBeTruthy()
      expect(isAbsoluteURL('http://example.com')).toBeTruthy()
      expect(isAbsoluteURL('custom-scheme-v1.0://example.com/')).toBeTruthy()
      expect(isAbsoluteURL('HTTP://example.com/')).toBeTruthy()
      expect(isAbsoluteURL('123://example.com/')).toBeFalsy()
      expect(isAbsoluteURL('!valid://example.com/')).toBeFalsy()
      expect(isAbsoluteURL('//example.com')).toBeTruthy()
      expect(isAbsoluteURL('/example.com')).toBeFalsy()
      expect(isAbsoluteURL('example.com')).toBeFalsy()
    })
  })

  describe('combineURL', () => {
    const baseUrl_1 = 'https://examples.com/'
    const baseUrl_2 = 'https://examples.com'
    const path_1 = '/some/path'
    const path_2 = 'some/path'
    const result = `${baseUrl_1}${path_2}`
    test('能正确拼接 url', () => {
      expect(combineURL(baseUrl_1, path_1)).toEqual(result)
      expect(combineURL(baseUrl_1, path_2)).toEqual(result)
      expect(combineURL(baseUrl_2, path_1)).toEqual(result)
      expect(combineURL(baseUrl_2, path_2)).toEqual(result)
      expect(combineURL(baseUrl_1, '/')).toEqual(baseUrl_1)

      expect(combineURL(baseUrl_1, '')).toEqual(baseUrl_1)
      expect(combineURL(baseUrl_1)).toEqual(baseUrl_1)
    })
  })
})
