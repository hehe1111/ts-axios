import axios from '../src/index'

describe('axios', () => {
  test('should support all', done => {
    axios.all([true, false]).then(arg => {
      expect(arg[0]).toBeTruthy()
      expect(arg[1]).toBeFalsy()
      done()
    })
  })

  test('should support spread', done => {
    let sum = 0
    let fulfilled = false

    axios
      .all([123, 456])
      .then(
        axios.spread((a, b) => {
          sum = a + b
          fulfilled = true
          return 'hello world'
        })
      )
      .then(result => {
        expect(fulfilled).toBeTruthy()
        expect(sum).toBe(123 + 456)
        expect(result).toBe('hello world')
        done()
      })
  })
})
