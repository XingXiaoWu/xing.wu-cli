#! /usr/bin/env node
//--inspect-brk
const create = require('../lib/init')
// 用来进行命令行交互的
const { program } = require('commander')

// 读取packgaejson
const packageConfig = require('../package.json')
// 这样输出-V或--version就能看到版本号了
program.version(packageConfig.version)

program
  // 命令
  .command('init <name>')
  .alias('i')
  // -h的时候命令描述
  .description('新建项目的命令')
  .action((name, cmd) => {
    console.log('开始新建项目，项目名' + name)
    create(name)
  })

program.on('--help', () => {
  console.log('新需求？可反馈给329106954@qq.com')
})

// 必须放到最后一行用于解析
program.parse(process.argv)