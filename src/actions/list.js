// 获取
const templatesJson = require('../config/templates/templates.json');
const { markLog } = require('../utils/log')

const list = () => {
    const templates = templatesJson
    Object.entries(templates).forEach(([key,value]) => {
        markLog(key + ': ' + value)
    })
}

module.exports = list;