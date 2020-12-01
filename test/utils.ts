export function getAjaxRequest(): Promise<JasmineAjaxRequest> {
  return new Promise(resolve => {
    // https://gist.github.com/paulsturgess/f1813e0cee2d39ea3b57ca155ec7fee7#file-service_spec-js-L19-L38
    setTimeout(() => {
      resolve(jasmine.Ajax.requests.mostRecent())
    }, 0)
  })
}
