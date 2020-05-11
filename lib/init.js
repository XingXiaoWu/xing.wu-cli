const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const symbols = require('log-symbols')
const inquirer = require('inquirer')
const ora = require('ora')
const download = require('download-git-repo')

// const packageConfig = require('../package.json')
const spinner = ora('下载中...')
const promptList = [
  // 具体交互内容
  {
    type: 'input',
    name: 'type',
    message: '请输入要拉取的模板类型，vue:1,react:2',
    default: '1',
  },
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
]
// 新建项目
async function create(projectName, options) {
  // 获取当前路径
  const cwd = process.cwd()
  // 看看是不是有人敲了路径
  // const inCurrent = projectName === '.'
  // const name = inCurrent ? path.relative('../', cwd) : projectName
  const targetDir = path.resolve(cwd, projectName || '.')
  // 判断当前路径下是否有这个文件夹
  if (!fs.existsSync(targetDir)) {
    // 没有
    // 1.创建交互
    inquirer.prompt(promptList).then((answers) => {
      // 2.拉取模板
      const { type, description, author, mail } = answers
      let url = ''
      if (type === "1") {
        console.log("正在拉取vue项目模板");
        url = "https://gitee.com:wuxinggg/vue-template#master";
      } else {
        console.log("正在拉取react项目模板");
        url = "https://gitee.com:wuxinggg/react-template#master";
      }
      spinner.start()
      downTemplate(url, projectName, () => {
        writePackageJson(targetDir, answers, projectName)
        // // 修改本地数据
        // successConsole(projectName)
      })
    })
  } else {
    // 有
    throw Error('当前路径已存在同名目录，请确定后再试')
  }
}
// 下载成功后重写package
function writePackageJson(targetDir, answers, name) {
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

  fs.writeFile(packpath, JSON.stringify(result, null, '\t'), function (err) {
    if (err) throw err
    successConsole(name)
  })
}

// 成功后的输出
function successConsole(projectName) {
  console.log(chalk.green('success'))
  console.log(chalk.magenta(`${projectName}创建成功, 执行下面命令启动项目`))
  console.log(chalk.magenta(` cd ${projectName}`))
  console.log(chalk.magenta(' yarn'))
  console.log(chalk.magenta(' yarn dev'))
}

// 下载模板
function downTemplate(url, projectName, callback) {
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
    // console.error(chalk.red.dim('出错了，憨批Error: ' + err))
    // stopSpinner(false) // do not persist
    // error(err)
    // if (!process.env.VUE_CLI_TEST) {
    // process.exit(1)
    // }
  })
}
