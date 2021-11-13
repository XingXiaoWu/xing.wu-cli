const cusRegs = require('../config/templates/custom.json');
const templates = require('../config/templates/templates.json');
const { successLog, errorLog } = require('../utils/log')
const path = require('path');
const fs = require('fs-extra')

const add = (name, url) => {
    // TODO:文件挪出去，避免覆盖
    let tmpAll = {
        ...templates,
        ...cusRegs,
    }
    if (tmpAll.hasOwnProperty(name)) {
        errorLog(name + "已存在，本次添加失败");
        return;
    }
    // 添加
    let tmp = {}
    tmp[name] = url
    let result = { ...tmp, ...cusRegs }
    const customPath = path.join(__dirname,"../config/templates/custom.json")
    // 转成json写入
    fs.writeFileSync(customPath, JSON.stringify(result, null, '\t'))
    successLog("成功写入,输入wxplatform-cli ls查看最新template")
}
module.exports = add