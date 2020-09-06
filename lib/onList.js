// const path = require('path');
// const fs = require('fs-extra')
const registries = require('../json/registries.json');
const cusRegs = require('../json/customregist.json');

function onList () {
    let allRegistries = getAllRegistry();
    let info = [];
    const keys = Object.keys(allRegistries);
    const len = Math.max(...keys.map(key => key.length)) + 3;
    Object.keys(allRegistries).forEach(function (key) {
        let item = allRegistries[key];
        info.push(key + line(key, len) + item);
    });
    printMsg(info);
}

function printMsg (infos) {
    infos.forEach(function (info) {
        console.log(info);
    });
}

function getAllRegistry () {
    const all = {
        ...registries,
        ...cusRegs,
    }
    return all;
}

function line (str, len) {
    var line = new Array(Math.max(1, len - str.length)).join('-');
    return ' ' + line + ' ';
}

module.exports = () => {
    onList()
}