#!/usr/bin/env node
// --inspect-brk

const { program } = require('commander')
const {figletLog} = require('./utils/log')
const init = require('./actions/init')
const list = require('./actions/list')
const add = require('./actions/add')
const del = require('./actions/del')
const addGitHooks = require('./actions/gitHooks')
// 读取packgaejson
const packageConfig = require('../package.json')

// 这样输出-V或--version就能看到版本号了
program.version(packageConfig.version)

// init
program
    .command('init <name>')
    .alias('i')
    .description('新建项目')
    .action((name) => {
        figletLog("XING.WU", () => {
            console.log('Windows同学请使用git bash')
            init(name);
        })

    });

// 添加模板
program
    .command('add-template <name> <url>')
    .description('本地添加模板, 域名:所有者/项目名称#分支 例如 https://github.com:xingxiaowu/template-vue#master')
    .action((name,url)=>{
        add(name,url)
    });

// 移除模板
program
    .command('remove-template <name>')
    .description('移除本地模板')
    .action((name)=>{
        del(name)
    });

// 添加git hook
program
    .command('add-githooks')
    .description('添加git hook')
    .action(()=>{
        figletLog("XING.WU",() =>{
            addGitHooks();
        })
    })

// 查看模板
program
    .command('ls')
    .alias('list')
    .description('查看当前所有模板')
    .action(()=>{
        list()
    })

// 需求响应
program.on('--help', () => {
    console.log('新需求？可反馈给329106954@qq.com')
})
// 必须放到最后一行用于解析
program.parse(process.argv)