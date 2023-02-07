### 爬取[网易云音乐](https://music.163.com/#)的node.js项目
1. npm install  下载相关依赖
2. node download-cloud-music  进行音乐爬取  需传入PC网页版网易云音乐链接
##### bin目录为爬虫核心请求逻辑
```javascript
   /**
 * 下载任意歌单内所有音乐
 * @param {*} url 
 */
async function downloadMusicList(url)
```
![url](https://github.com/wy-linux/node-spider-cloudMusic/blob/master/assets/downloadMusicList-url.png)
```javascript
/**
 * 下载某一首音乐
 * @param {*} hrefUrl 
 * @param {*} name 目标下载音乐的名称，可以不传
 * @returns 
 */
async function downloadMusic(hrefUrl, name) 
```
![url](https://github.com/wy-linux/node-spider-cloudMusic/blob/master/assets/downloadMusic-url.png)
##### 后续可以采用Puppeteer模拟用户操作爬取
