import { AxiosError, createError } from '../../src/helpers/error'
import { AxiosRequestConfig, AxiosResponse } from '../../src/types'

describe('src/helpers/error.ts', () => {
  test('should create an Error with message, config, code, request, response and isAxiosError', () => {
    const request = new XMLHttpRequest()
    const config: AxiosRequestConfig = { method: 'post' }
    const response: AxiosResponse = {
      data: { foo: 'bar' },
      status: 200,
      statusText: 'OK',
      headers: null,
      config,
      request
    }
    const error = createError({ message: 'Boom!', config, code: 'SOME CODE', request, response })
    expect(error instanceof Error).toBeTruthy()
    expect(error instanceof AxiosError).toBeTruthy()
    expect(error.message).toBe('Boom!')
    expect(error.config).toBe(config)
    expect(error.code).toBe('SOME CODE')
    expect(error.request).toBe(request)
    expect(error.response).toBe(response)
    expect(error.isAxiosError).toBeTruthy()
  })
})
