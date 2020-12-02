import Cancel, { isCancel } from '../../src/cancel/Cancel'

describe('src/cancel/Cancel.ts', () => {
  test('should returns correct result when message is specified', () => {
    const message = 'Operation has been canceled.'
    const cancel = new Cancel(message)
    expect(cancel.message).toBe(message)
  })

  test('should returns true if value is a Cancel', () => {
    expect(isCancel(new Cancel())).toBeTruthy()
  })

  test('should returns false if value is not a Cancel', () => {
    expect(isCancel({ foo: 'bar' })).toBeFalsy()
  })
})
