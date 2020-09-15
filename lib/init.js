const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const symbols = require('log-symbols')
const inquirer = require('inquirer')
const ora = require('ora')
const shell = require('shelljs');
const _ = require('lodash')
const download = require('download-git-repo')
const { getAllTemplates, gitTogitdown } = require('../utils')
// const packageConfig = require('../package.json')
const spinner = ora('下载中...')
const promptList = [
    // 具体交互内容
    // {
    //     type: 'input',
    //     name: 'type',
    //     message: '请输入要拉取的模板类型，vue:1',
    //     default: '1',
    // },
    {
        type: 'input',
        name: 'author',
        message: '作者:',
        default: '',
    },
    {
        type: 'input',
        name: 'mail',
        message: '邮箱:',
        default: '',
    },
    {
        type: 'input',
        name: 'description',
        message: '描述:',
        default: '',
    },
    {
        type: 'input',
        name: 'gitrepo',
        message: 'git地址:',
        default: '',
    }
]
// 新建项目
async function create (projectName, options) {
    // 获取当前路径
    const cwd = process.cwd()
    const targetDir = path.resolve(cwd, projectName || '.')
    // 获取当前可选模板
    const allTemplate = getAllTemplates();
    const keys = Object.keys(allTemplate);
    let tmpSwitch = {
        type: 'list',
        name: 'template',
        message: '选择初始化的template',
        choices: keys
    }
    promptList.unshift(tmpSwitch)

    // 判断当前路径下是否有这个文件夹
    if (!fs.existsSync(targetDir)) {
        // 没有
        // 1.创建交互
        inquirer.prompt(promptList).then((answers) => {
            // 2.拉取模板
            const { template, description, author, mail, gitrepo } = answers
            console.log('正在拉取' + template + '项目模板')
            // https://gitea.51trust.com/front/vueDemo.git
            let url = gitTogitdown(allTemplate[template])
            spinner.start()
            downTemplate(url, projectName, () => {
                writePackageJson(targetDir, answers, projectName)
                // 先cd到对应目录下
                shell.cd(projectName);
                // 创建git
                gitInit(gitrepo)
                npminstall()
                eslint()
                successConsole(projectName)
            })
        })
    } else {
        // 有
        throw Error('当前路径已存在同名目录，请确定后再试')
    }
}
// 创建git
function gitInit (repo) {
    if (!shell.which('git')) {
        shell.echo('请检查本机git环境是否正常');
        shell.exit(1);
    } else {
        shell.exec('git init')
        if (!_.isEmpty(repo)) {
            shell.exec('git remote add origin ' + repo)
            shell.exec('git add .')
            shell.exec('git commit -m "init"')
            shell.exec('git push --set-upstream origin master')
        }
    }
}
// 拉取代码
function npminstall () {
    shell.exec('npm install')
}
// eslint修复
function eslint () {
    // shell.exec('npm run eslint')
}
// 下载成功后重写package
function writePackageJson (targetDir, answers, name) {
    const { description, author, mail } = answers
    let packpath = targetDir + '/package.json'
    // 读取package内容
    let tmpJson = fs.readFileSync(packpath)
    let packageJson = JSON.parse(tmpJson)
    let result = {
        ...packageJson,
        name,
        description,
        author,
        mail,
    }

    fs.writeFileSync(packpath, JSON.stringify(result, null, '\t'))
}

// 成功后的输出
function successConsole (projectName) {
    console.log(chalk.green('success'))
    console.log(chalk.magenta(`${projectName}创建成功`))
    // 判断系统类型
    if (process.platform !== 'darwin') {
        console.log(chalk.magenta(`检测到您是windows系统,请使用git bash打开项目根目录,执行npm run lf再运行项目`))
    }
    console.log(chalk.green('执行下面命令启动项目'))
    console.log(chalk.magenta(` cd ${projectName}`))
    console.log(chalk.magenta(' Vue项目:npm run serve'))
    console.log(chalk.magenta(' electron-vue项目:npm run electron:serve'))
}

// 下载模板
function downTemplate (url, projectName, callback) {
    download(url, projectName, { clone: true }, (err) => {
        // 判断是否下载失败
        if (err) {
            // 下载失败
            spinner.fail()
            throw err
        } else {
            // 下载成功
            spinner.succeed()
            callback()
        }
    })
}

module.exports = (...args) => {
    return create(...args).catch((err) => {
        console.log(symbols.error, chalk.red(err))
        process.exit(1)
    })
}
