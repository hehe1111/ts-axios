import { isPlainObject } from './utils'

export const stringifyData = (data: any): any => {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}

export const parseData = (data: any): any => {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (error) {
      // do nothing
    }
  }
  return data
}
