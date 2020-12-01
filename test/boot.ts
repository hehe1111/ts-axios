const JasmineCore = require('jasmine-core')

// https://github.com/jasmine/jasmine-ajax/issues/178
// @ts-ignore
global.getJasmineRequireObj = function() {
  return JasmineCore
}
require('jasmine-ajax')
