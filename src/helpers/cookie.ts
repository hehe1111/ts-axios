const cookie = {
  read(name: string): string | null {
    // new RegExp('(^|;\\s*)(' + name + ')=([^;]*)')
    const regexp = new RegExp('.*' + name + '=([^;]*).*')
    const match = document.cookie.match(regexp)

    // match[3]
    return match ? decodeURIComponent(match[1]) : null
  }
}

export default cookie
