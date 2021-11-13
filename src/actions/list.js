// 获取
const templatesJson = require('../config/templates/templates.json');
const customJson = require('../config/templates/custom.json');
const { markLog } = require('../utils/log')

const list = () => {
    const tmp = {
        ...templatesJson,
        ...customJson
    }
    Object.entries(tmp).forEach(([key,value]) => {
        markLog(key + ': ' + value)
    })
}

module.exports = list;