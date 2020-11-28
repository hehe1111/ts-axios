export default class Cancel {
  constructor(public message?: string) {}
}

export function isCancel(value: any): boolean {
  return value instanceof Cancel
}
