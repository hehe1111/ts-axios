import { stringifyData, parseData } from '../../src/helpers/data'

describe('src/helpers/data.ts', () => {
  describe('stringifyData', () => {
    test('should transform request data to string if data is a PlainObject', () => {
      expect(stringifyData({ a: 1 })).toBe('{"a":1}')
    })

    test('should do nothing if data is not a PlainObject', () => {
      const a = new URLSearchParams('a=b')
      expect(stringifyData(a)).toBe(a)
    })
  })

  describe('parseData', () => {
    test('should transform response data to Object if data is a JSON string', () => {
      const a = '{"a": 2}'
      expect(parseData(a)).toEqual({ a: 2 })
    })

    test('should do nothing if data is a string but not a JSON string', () => {
      const a = '{a: 2}'
      expect(parseData(a)).toBe('{a: 2}')
    })

    test('should do nothing if data is not a string', () => {
      const a = { a: 2 }
      expect(parseData(a)).toBe(a)
    })
  })
})
