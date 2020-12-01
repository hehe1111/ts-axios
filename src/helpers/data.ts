import { isPlainObject } from './utils'

export const stringifyData = (data: any): any => {
  return isPlainObject(data) ? JSON.stringify(data) : data
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
