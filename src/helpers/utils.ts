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
