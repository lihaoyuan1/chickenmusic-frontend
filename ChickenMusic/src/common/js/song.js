import {_get} from '../../api/api'

export default class Song {
  constructor ({id, singer, album, name, duration, image, url}) {
    this.id = id
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }

  getLyric () {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      _get('lyric', {id: this.id}).then(response => {
        this.lyric = response.lyric
        resolve(this.lyric)
      })
    })
  }
}

export function createSong (musicData) {
  return new Song({
    id: musicData.id,
    singer: filterSinger(musicData.singer),
    name: musicData.name,
    album: musicData.album,
    duration: musicData.duration,
    image: musicData.picture,
    url: `http://music.163.com/song/media/outer/url?id=${musicData.id}`
  })
}

function filterSinger (singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach(item => {
    ret.push(item.name)
  })
  return ret.join(' / ')
}
