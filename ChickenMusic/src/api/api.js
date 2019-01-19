import VueResource from 'vue-resource'
import Vue from 'vue'
import jsonp from '../common/js/jsonp'
Vue.use(VueResource)
Vue.http.options.withCredentials = true

const PREURL = 'http://129.204.34.155:8081/music/'

export function _get (url, data) {
  return Vue.http.get(PREURL + url, {params: data}, {emulateJSON: true}).then(response => {
    return Promise.resolve(response.data)
  }, error => {
    console.log(error)
  })
}

export function _post (url, data) {
  return Vue.$http.post(PREURL + url, data, {emulateJSON: true}).then(response => {
    return Promise.resolve(response.data)
  }, error => {
    console.log(error)
  })
}

export function getHotKey () {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
  const data = Object.assign({}, {
    g_tk: 5381,
    uin: 0,
    format: 'json',
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'h5',
    needNewCode: 1,
    _: '1546101940637'
  })
  return jsonp(url, data, {param: 'jsonpCallback'})
}
