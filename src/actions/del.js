const cusRegs = require('../config/templates/custom.json');
const templates = require('../config/templates/templates.json');
const { successLog, errorLog } = require('../utils/log')
const path = require('path');
const fs = require('fs-extra')
const _ = require('lodash')

function del (name) {
    if (templates.hasOwnProperty(name)) {
        errorLog(name + "为预设定模板,不可删除");
        return;
    } else if (!cusRegs.hasOwnProperty(name)) {
        successLog(name + "模板不存在,请检查输入是否正确");
        return;
    }
    // 添加
    let result = _.omit(cusRegs, name)
    // 转成json写入
    const customPath = path.join(__dirname,"../config/templates/custom.json")
    // 转成json写入
    fs.writeFileSync(customPath, JSON.stringify(result, null, '\t'))
    successLog("成功删除,输入xingwu ls查看最新template")
}

module.exports = del