const download = require('download-git-repo');
const { markLog, errorLog, successLog } = require('./log');
const spiner = require('./spinner');
/**
 * 下载模板
 * @param {*} url git下载地址
 * @param {*} name 项目名称
 * @returns 
 */
const down = (url, name) =>{
    // spiner.start();
    markLog('下载中');
    return new Promise((resolve, reject) =>{
        download(url,name,{ clone: true }, (err) => {
            if(err){
                // spiner.fail();
                errorLog('下载失败');
                reject(err);
            }else{
                // spiner.succeed();
                successLog('下载完毕');
                resolve();
            }
        })
    })
}

module.exports = {
    down
}