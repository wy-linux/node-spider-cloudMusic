const ProgressBar = require('progress');
function getUrlId(url) {
    return /id=(\w+)/.exec(url)[1]
}
function formatName(name) {
    name = name ?? '请输入歌曲名称！'
    return name.replace(/[\\/\s]/g, '')
}/**
 * 将一个数组转换成4个一组的形式（限制并发数量最好使用下面的Scheduler）
 * @param {*} arr 
 * @returns 
 */
function toFourItemPerGroup(arr) {
    let PerGroupArr = []
    let GroupArr = []
    for(let i = 0; i < arr.length; i++) {
        PerGroupArr.push(arr[i])
        if((i + 1) % 4 === 0) {
            //解构数组重新生成产生深拷贝的效果
            GroupArr.push([...PerGroupArr])
            PerGroupArr.length = 0
        }
    }
    return GroupArr
}
/**
 * 在Promise.all的基础上封装的并发调度器，限制并发数量
 * @param {*} actions 
 * @param {*} limit 
 * @param {*} callback 
 * @returns 
 */
async function Scheduler(actions, limit, callback) { 
    const results = []
    for(let i=0; i<=actions.length; i+=limit) {
      const tasks = []
        // 切片 Promise.all 的参数
      for(const action of actions.slice(i, i + limit)) {
        action.forEach((value, key) => {
           tasks.push(callback(value, key))
        })
      }
      // 用 await 以确保后面的任务不会在执行当前任务时执行
      const result = await Promise.all(tasks)
      console.log(result);
      results.push(...result)
    }
    return results
  }

function showCliProgress(name, progressEvent) {
  const bar = new ProgressBar(
     `${name} [:bar]  :percent :etas`, 
    {
      complete: '='
      , incomplete: ' '
      , width: 60
      , total: progressEvent.total || 0
    }
  )
  bar.tick(progressEvent.loaded )    
}
module.exports = {getUrlId, toFourItemPerGroup, formatName, Scheduler, showCliProgress}