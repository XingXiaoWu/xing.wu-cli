#!/usr/bin/env node
// --inspect-brk
const create = require('../lib/init')
const onList = require('../lib/onList')
const onAdd = require('../lib/onAdd')
const onDel = require('../lib/onDel')
// 用来进行命令行交互的
const { program } = require('commander')

// 读取packgaejson
const packageConfig = require('../package.json')
// 这样输出-V或--version就能看到版本号了
program.version(packageConfig.version)

// init
program
    .command('init <name>')
    .alias('i')
    .description('新建项目的命令')
    .action((name, cmd) => {
        console.log('开始新建项目，项目名' + name)
        create(name)
    })

// 查看模板
program
    .command('ls')
    .description('查看当前所有模板')
    .action(onList)

// 添加模板
program
    .command('add <name> <url>')
    .description('本地添加模板, 域名:所有者/项目名称#分支 例如 https://github.com:xingxiaowu/template-vue#master')
    .action(onAdd);

// 移除模板
program
    .command('del <name>')
    .description('移除本地模板')
    .action(onDel);

program.on('--help', () => {
    console.log('新需求？可反馈给329106954@qq.com')
})

// 必须放到最后一行用于解析
program.parse(process.argv)
