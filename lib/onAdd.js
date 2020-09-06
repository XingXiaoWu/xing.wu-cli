const cusRegs = require('../json/customregist.json');
const { wirteSync, successConsole, errorConsole, getAllTemplates } = require('../utils')
function onAdd (name, url) {
    let tmpAll = getAllTemplates()
    if (tmpAll.hasOwnProperty(name)) {
        errorConsole(name + "已经被使用");
        return;
    }
    // 添加
    let tmp = {}
    tmp[name] = url
    let result = { ...tmp, ...cusRegs }
    // 转成json写入
    wirteSync('/json/customregist.json', result)
    successConsole("成功写入,输入szyx-cli ls查看最新template")
}

module.exports = (name, url) => {
    onAdd(name, url)
}