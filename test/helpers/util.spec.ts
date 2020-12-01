import {
  getTypeOf,
  isDate,
  isPlainObject,
  extend,
  deepMerge,
  isFormData,
  isURLSearchParams
} from '../../src/helpers/utils'

describe('src/helpers/utils.ts', () => {
  describe('getTypeOf', () => {
    test('null 返回 "null"', () => expect(getTypeOf(null)).toBe('null'))
    test('undefined 返回 "undefined"', () => expect(getTypeOf(undefined)).toBe('undefined'))
    ;[0, 1, -1, NaN].map(i => test(`${i} 返回 "number"`, () => expect(getTypeOf(i)).toBe('number')))
    ;['', '0', '1', '-1', 'NaN', 'true', 'false', '{}', '[]'].map(i =>
      test(`'${i}' 返回 "string"`, () => expect(getTypeOf(i)).toBe('string'))
    )
    ;[true, false].map(i => test(`${i} 返回 "boolean"`, () => expect(getTypeOf(i)).toBe('boolean')))
    test('Symbol() 返回 "symbol"', () => expect(getTypeOf(Symbol())).toBe('symbol'))

    test('[] 返回 "array"', () => expect(getTypeOf([])).toBe('array'))
    test('{} 返回 "object"', () => expect(getTypeOf({})).toBe('object'))
    test('new Set() 返回 "set"', () => expect(getTypeOf(new Set())).toBe('set'))
    test('new WeakSet() 返回 "weakset"', () => expect(getTypeOf(new WeakSet())).toBe('weakset'))
    test('new Map() 返回 "map"', () => expect(getTypeOf(new Map())).toBe('map'))
    test('new WeakMap() 返回 "weakmap"', () => expect(getTypeOf(new WeakMap())).toBe('weakmap'))

    test('new Date() 返回 "date"', () => expect(getTypeOf(new Date())).toBe('date'))
    test('Date.now() 返回 "number"', () => expect(getTypeOf(Date.now())).toBe('number'))

    test('new RegExp(/\\d+/gi) 返回 "regexp"', () => {
      expect(getTypeOf(new RegExp(/\d+/gi))).toBe('regexp')
    })
    test('/\\d+/gi 返回 "regexp"', () => expect(getTypeOf(/\d+/gi)).toBe('regexp'))

    test('new Int8Array([12, 34]) 返回 "int8array"', () => {
      expect(getTypeOf(new Int8Array([12, 34]))).toBe('int8array')
    })
    test('new Int32Array([12, 34]) 返回 "int32array"', () => {
      expect(getTypeOf(new Int32Array([12, 34]))).toBe('int32array')
    })

    test('function foo() {} 返回 "function"', () => {
      expect(getTypeOf(function foo() {})).toBe('function')
    })
    test('() => {} 返回 "function"', () => expect(getTypeOf(() => {})).toBe('function'))
    test('class {} 返回 "function"', () => expect(getTypeOf(class {})).toBe('function'))
  })

  describe('isDate', () => {
    test('能正确校验 Date', () => {
      expect(isDate(new Date())).toBeTruthy()
      expect(isDate(Date.now())).toBeFalsy()
    })
  })

  describe('isPlainObject', () => {
    test('能正确校验 PlainObject', () => {
      expect(isPlainObject({})).toBeTruthy()
      expect(isPlainObject(null)).toBeFalsy()
      expect(isPlainObject(new Date())).toBeFalsy()
    })
  })

  describe('extend', () => {
    test('能成功浅复制', () => {
      const a = Object.create(null)
      const b = { foo: { bar: 123 } }
      extend(a, b)
      expect(a.foo.bar).toBe(123)
      b.foo.bar = 456
      expect(a.foo.bar).toBe(456)
    })

    test('后面对象的值能成功覆盖前面对象', () => {
      const a = { foo: 123, bar: 456 }
      const b = { bar: 789 }
      const c = extend(a, b)
      expect(c.foo).toBe(123)
      expect(c.bar).toBe(789)
    })
  })

  describe('deepMerge', () => {
    test('能成功深复制', () => {
      const e = { foo: { bar: 123 } }
      const f = { foo: { baz: 456 }, bar: { qux: 789 } }
      const g = deepMerge(e, f)
      expect(g).toEqual({ foo: { bar: 123, baz: 456 }, bar: { qux: 789 } })
    })

    test('不影响源对象', () => {
      const a = Object.create(null)
      const b: any = { foo: 123 }
      const c: any = { bar: 456 }
      const d = deepMerge(a, b, c)
      expect(typeof a.foo).toBe('undefined')
      expect(typeof a.bar).toBe('undefined')
      expect(typeof b.bar).toBe('undefined')
      expect(typeof c.foo).toBe('undefined')
      expect(d.foo).toBe(123)
      expect(d.bar).toBe(456)

      const h = { foo: { bar: 123 } }
      const i = {}
      const j = deepMerge(h, i)
      expect(j).toEqual({ foo: { bar: 123 } })
      expect(j.foo).not.toBe(h.foo)
      expect(j.foo.bar).toEqual(h.foo.bar)
      h.foo.bar = 456
      expect(j.foo.bar).not.toEqual(h.foo.bar)
    })

    test('参数为 null 和 undefined 时则忽略', () => {
      expect(deepMerge(undefined, undefined)).toEqual({})
      expect(deepMerge(undefined, { foo: 123 })).toEqual({ foo: 123 })
      expect(deepMerge({ foo: 123 }, undefined)).toEqual({ foo: 123 })
      expect(deepMerge(null, null)).toEqual({})
      expect(deepMerge(null, { foo: 123 })).toEqual({ foo: 123 })
      expect(deepMerge({ foo: 123 }, null)).toEqual({ foo: 123 })
    })
  })

  describe('isFormData', () => {
    test('能正确校验 FormData', () => {
      expect(isFormData(new FormData())).toBeTruthy()
      expect(isFormData({})).toBeFalsy()
    })
  })

  describe('isURLSearchParams', () => {
    test('能正确校验 URLSearchParams', () => {
      expect(isURLSearchParams(new URLSearchParams())).toBeTruthy()
      expect(isURLSearchParams('foo=1&bar=2')).toBeFalsy()
    })
  })
})
