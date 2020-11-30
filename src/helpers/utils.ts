export const getTypeOf = (target: any): string => {
  const regex: RegExp = /\[object (.*)\]/
  const typeString: string = Object.prototype.toString.call(target)
  return typeString.match(regex)![1].toLowerCase()
}

export function isDate(param: any): param is Date {
  return getTypeOf(param) === 'date'
}

export function isPlainObject(param: any): param is Object {
  return param !== null && getTypeOf(param) === 'object'
}

export const extend = <T, U>(to: T, from: U): T & U => {
  for (const key in from) {
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}

export function deepMerge(...objs: any[]): any {
  const result = Object.create(null)

  objs.forEach(obj => {
    obj &&
      Object.keys(obj).forEach(key => {
        const val = obj[key]
        if (isPlainObject(val)) {
          if (isPlainObject(result[key])) {
            result[key] = deepMerge(result[key], val)
          } else {
            result[key] = deepMerge({}, val)
          }
        } else {
          result[key] = val
        }
      })
  })

  return result
}

export function isFormData(val: any): boolean {
  return typeof val !== 'undefined' && val instanceof FormData
}

export function isURLSearchParams(val: any): val is URLSearchParams {
  // https://developer.mozilla.org/zh-CN/docs/Web/API/URLSearchParams
  return typeof val !== 'undefined' && val instanceof URLSearchParams
}
