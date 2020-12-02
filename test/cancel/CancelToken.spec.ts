import Cancel from '../../src/cancel/Cancel'
import CancelToken from '../../src/cancel/CancelToken'
import { Canceler } from '../../src/types'

const message = 'Operation has been canceled.'

describe('src/cancel/CancelToken.ts', () => {
  describe('reason', () => {
    test('should returns a Cancel if cancellation has been requested', () => {
      let cancel: Canceler
      const token = new CancelToken(c => (cancel = c))
      cancel!(message)
      expect(token.reason).toEqual(expect.any(Cancel))
      expect(token.reason!.message).toBe(message)
    })

    test('should has no side effect if call cancellation for multi times', () => {
      let cancel: Canceler
      const token = new CancelToken(c => (cancel = c))
      cancel!(message)
      cancel!(message)
      expect(token.reason).toEqual(expect.any(Cancel))
      expect(token.reason!.message).toBe(message)
    })

    test('should returns undefined if cancellation has not been requested', () => {
      const token = new CancelToken(() => {
        // do nothing
      })
      expect(token.reason).toBeUndefined()
    })
  })

  describe('promise', () => {
    test('should returns a Promise that resolves when cancellation is requested', done => {
      let cancel: Canceler
      const token = new CancelToken(c => (cancel = c))
      token.promise.then(value => {
        expect(value).toEqual(expect.any(Cancel))
        expect(value.message).toBe(message)
        done()
      })
      cancel!(message)
    })
  })

  describe('throwIfRequested', () => {
    test('should throws if cancellation has been requested', () => {
      let cancel: Canceler
      const token = new CancelToken(c => (cancel = c))
      cancel!(message)
      try {
        token.throwIfRequested()
        fail('Expected throwIfRequested to throw.')
      } catch (thrown) {
        if (!(thrown instanceof Cancel)) {
          fail('Expected throwIfRequested to throw a Cancel, but test threw ' + thrown + '.')
        }
        expect(thrown.message).toBe(message)
      }
    })

    test('should does not throw if cancellation has not been requested', () => {
      const token = new CancelToken(() => {
        // do nothing
      })
      token.throwIfRequested()
    })
  })

  describe('source', () => {
    test('should returns an object containing token and cancel function', () => {
      const source = CancelToken.source()
      expect(source.token).toEqual(expect.any(CancelToken))
      expect(source.cancel).toEqual(expect.any(Function))
      expect(source.token.reason).toBeUndefined()
      source.cancel(message)
      expect(source.token.reason).toEqual(expect.any(Cancel))
      expect(source.token.reason!.message).toBe(message)
    })
  })
})
