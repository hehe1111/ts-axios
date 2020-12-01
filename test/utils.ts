/**
 * @description 会为发出的 Ajax 请求根据规范定义一组假的响应，并跟踪发出的 Ajax 请求，方便为结果做断言
 */
export function getAjaxRequest(): Promise<JasmineAjaxRequest> {
  return new Promise(resolve => {
    // https://gist.github.com/paulsturgess/f1813e0cee2d39ea3b57ca155ec7fee7#file-service_spec-js-L19-L38
    setTimeout(() => {
      // 拿到最近一次请求的 request 对象，这个 request 对象是 jasmine-ajax 库伪造的 xhr 对象，它模拟了 xhr 对象上的方法，并且提供一些 api 可供使用，比如 request.respondWith 方法返回一个响应
      resolve(jasmine.Ajax.requests.mostRecent())
    }, 0)
  })
}
