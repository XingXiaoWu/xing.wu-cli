const path = require('path');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const shell = require('shelljs');
const { successLog, markLog } = require('../utils/log')
const { down } = require('../utils/downTemplate');
const templatesJson = require('../config/templates/templates.json');
const exit = require('../utils/exit');
const os = require('os');
// 制定具体交互内容

const promptList = [{
    type: 'input',
    name: 'author',
    message: '作者：',
    default: '',
}, {
    type: 'input',
    name: 'mail',
    message: '邮箱:',
    default: '',
}, {
    type: 'input',
    name: 'description',
    message: '描述：',
    default: '',
}, {
    type: 'input',
    name: 'gitrepo',
    message: 'git地址：',
    default: '',
}];

// 新建项目

const init = async (name) => {
    // 获取当前执行命令的路径
    const cwd = process.cwd();
    const target = path.resolve(cwd, name || '.')
    // 获取可选模板
    const templates = { ...templatesJson }
    const keys = Object.keys(templates)

    // 交互添加模板
    let tmpSwitch = {
        type: 'list',
        name: 'template',
        message: '选择需要的模板编号',
        choices: keys
    }

    promptList.unshift(tmpSwitch)

    // 判断当前路径下是否已经存在文件夹
    if (fs.existsSync(target)) {
        exit('当前路径下已存在该文件夹');
    }
    // c创建交互
    inquirer.prompt(promptList).then(async (answers) => {
        const { template, description, author, gitrepo } = answers
        const templateUrl = templates[template]
        try {
            // 拉取模板
            await down(templateUrl, name);
            afterDown(name, answers);
        } catch (error) {
            exit(error.message);
        }
        // 替换
    })
}

const afterDown = (name, answers) => {
    // 1.重写packageJson
    writePackageJson(name, answers);
    // 1.1.重写nginx配置
    // writeNginxConfig(name);
    // 2.移除.git并添加新的上传
    successLog('初始化git');
    gitInit(name, answers.gitrepo);
    // 3.执行npm install,这一步时间太长了，抛出去让用户做吧
    // console.log('npm install 中，请耐心等待');
    //npmInstall();
    // 4.成功提示
    success(name);
}


const writePackageJson = (name, answers) => {
    const { description, author } = answers
    const cwd = process.cwd();
    const packagePath = path.resolve(cwd, name, './package.json');
    // 读取内容并覆盖
    let tmpJson = fs.readFileSync(packagePath);
    let packageJson = JSON.parse(tmpJson);
    let result = {
        ...packageJson,
        name,
        description,
        author,
    }
    fs.writeFileSync(packagePath, JSON.stringify(result, null, '\t'));
}

const writeNginxConfig = (name) => {
    const cwd = process.cwd();
    const nginxPath = path.resolve(cwd, name, './docker');

    // 
    shell.cd(nginxPath)
    if (os.type() == 'Windows_NT') {
        //windows
        shell.exec("sed  -i 's#moedu-web-template#" + name + "#g'  " + nginxPath + '/nginx.conf')
    } else if (os.type() == 'Darwin') {
        //mac
        shell.exec("sed  -i '' 's#moedu-web-template#" + name + "#g'  " + nginxPath + '/nginx.conf')
    }
    // 回到最外层
    shell.cd('../../')
}

const gitInit = (name, gitrepo) => {
    shell.cd(name);
    // 判断是否安装了git
    if (!shell.which('git')) {
        shell.echo('请检查本机是否安装git环境');
        shell.exit(1);
    } else {
        shell.exec('git init');
        shell.exec('git add .');
        shell.exec('git commit -m "init"');
        if (gitrepo !== '') {
            shell.exec('git remote add origin ' + gitrepo);
            shell.exec('git push --set-upstream origin master');
        }
    }
}

const npmInstall = () => {
    shell.exec('npm install');
}


const success = (name) => {
    successLog('success');
    markLog(`${name} 创建成功`);
    successLog('执行下面命令启动项目');
    markLog(`cd ${name}`);
    markLog('npm install');
    markLog('npm run serve');
    if (os.type() == 'Windows_NT') {
        //windows
        markLog('请在git bash 中执行 npm run lf');
    }
}

module.exports = init