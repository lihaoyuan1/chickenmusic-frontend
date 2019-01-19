import originJsonp from 'jsonp'

export default function jsonp (url, data, option) {
  // indexOf('?'): url find '?'
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  return new Promise((resolve, reject) => {
    originJsonp(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

export function param (data) {
  let url = ''
  for (let k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    // encodeURIComponent(): encode a string as a URI component.
    url += `&${k}=${encodeURIComponent(value)}`
  }
  // Get rid of the first '&'
  return url ? url.substring(1) : ''
}
