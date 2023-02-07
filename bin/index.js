const cheerio = require('cheerio')
const axios = require('axios')
const fs = require('fs')
const {promisify} = require('util')
const {headers} = require('../config')
const {
    getUrlId,
    formatName, 
    Scheduler, 
    showCliProgress
} = require('../util')
//http://music.163.com/song/media/outer/url?id=468490571
/**
 * TODO 根据url爬取所有收藏歌单的全部音乐, 使用puppeteer模拟用户点击抓取
 */
async function downloadCollectMusicLists(url) {

}
/**
 * 下载任意歌单内所有音乐
 * @param {*} url 
 */
async function downloadMusicList(url) {
    url = getUrlId(url)
    let res = await axios({
        url: 'https://music.163.com/playlist?id=' + url,
        method: 'get',
        headers
    })
    // await promisify(fs.writeFile)('./cloudMusic.html', res.data)
    const $ = cheerio.load(res.data)
    const musicInfoList = $('.f-hide a').map((_, item) => {
        const musicListMap = new Map()
        return musicListMap.set($(item).text(), $(item).attr('href'))
    })
    //使用Scheduler限制并发数量(更快拿到结果，同时防止被封IP)
    Scheduler(musicInfoList, 4, downloadMusic)
}
/**
 * 下载某一首音乐
 * @param {*} hrefUrl 
 * @param {*} name 目标下载音乐的名称，可以不传
 * @returns 
 */
async function downloadMusic(hrefUrl, name) {
    if(!fs.existsSync('./cloud-music')) {
        promisify(fs.mkdir)('./cloud-music')
    }
    const url = `http://music.163.com/song/media/outer/url?id=${getUrlId(hrefUrl)}`
    let writeStream = fs.createWriteStream(`./cloud-music/${formatName(name)}.mp3`)
    let res = await axios({
        url,
        method: 'get',
        headers,
        responseType: 'stream',
        onDownloadProgress: (progressEvent) => {
            // const progress = progressEvent.loaded / progressEvent.total * 100 
            //     console.log(`
            //     ------------------------
            //     ${name}-下载进度${progress}%
            //     `); 
            showCliProgress(name, progressEvent)//在命令行展示下载进度
        }
    })
    return new Promise((resolve, reject) => {
        res.data.pipe(writeStream)
           .on('finish', () => {
                writeStream.close()
                resolve(`${name}--下载完成`)
              })
           .on('error', (err) => {
                reject(err)
           })
    })

}
// downMusicList('https://music.163.com/#/playlist?id=5028586075')
module.exports = {
    downloadCollectMusicLists,
    downloadMusicList,
    downloadMusic
}