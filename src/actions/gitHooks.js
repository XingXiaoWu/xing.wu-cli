const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs-extra');
const shell = require('shelljs');
const exit = require('../utils/exit');
const { successLog } = require('../utils/log');

const addHusky = async () => {
    // 判断当前包管理器
    const {pm} = await inquirer.prompt([{
        type: 'list',
        name: 'pm',
        message: '请选择当前项目的包管理器',
        choices: [
            'npm',
            'yarn',
            'pnpm',
            'yarn2',
        ]
    }])
    // 不同包管理器使用不同命令
    if (pm === 'yarn2') {
        shell.exec('yarn dlx husky-init --yarn2 && yarn');
    } else{
        shell.exec(`npx husky-init && ${pm} install`);
    }
}

const addHooks = async () => {
    const {lint} =  await inquirer.prompt([{
        type: 'confirm',
        name: 'lint',
        message: '请查看package.json中的script是否存在lint命令',
        default: true
    }])
    const cwd = process.cwd();
    const target = path.resolve(cwd, './.husky')
    const hookPath = path.resolve(__dirname,'../config/hooks')
    if (lint) {
        fs.copySync(hookPath+'/pre-commit',target+'/pre-commit')
    }else{
        fs.removeSync(target+'/pre-commit')
    }
    fs.copySync(hookPath+'/commit-msg',target+'/commit-msg')
}
const addGitHooks = async () => {
    // 1.要求确认当前是否为项目根目录
    const cwd = process.cwd();
    const {root} = await inquirer.prompt([{
        type: 'confirm',
        name: 'root',
        message: `${cwd},是否为项目根目录？`,
        default: true,
    }])
    if (!root) {
        exit('请到项目根目录下执行')
    }
    // 2.确认当前目录下没有.husky文件夹
    const huskyTarget = path.resolve(cwd, '.husky')
    if(fs.existsSync(huskyTarget)){
        exit('当前项目已经集成git hook,请参考husky官网添加hook文件');
    }
    // 3.确实没有，开始添加内容
    await addHusky();
    // 4.添加hooks
    await addHooks();
    // 5.完成
    successLog('添加git hook完毕');
}


module.exports = addGitHooks