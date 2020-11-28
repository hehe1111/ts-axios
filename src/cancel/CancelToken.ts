import { Canceler, CancelExecutor, CancelTokenSource } from '../types'
import Cancel from './Cancel'

interface ResolveFn {
  (reason?: Cancel): void
}

export default class CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  constructor(executor: CancelExecutor) {
    let resolveFn: ResolveFn
    this.promise = new Promise<Cancel>(resolve => (resolveFn = resolve))

    executor(message => {
      if (this.reason) return
      this.reason = new Cancel(message)
      resolveFn(this.reason)
    })
  }

  static source(): CancelTokenSource {
    let cancel!: Canceler
    const token = new CancelToken(c => (cancel = c))
    return { cancel, token }
  }

  throwIfRequested(): void {
    if (this.reason) throw this.reason
  }
}
