#! /usr/bin/env node
// 用来进行命令行交互的
const program = require("commander");
// 读取处理文件
const fs = require("fs");
// 用于下载远程template的
const download = require("download-git-repo");
// 添加命令行输出背景色
const chalk = require("chalk");

const handlebars = require("handlebars");
// 	命令行中可以使用对话或者选项了
const inquirer = require("inquirer");
//  动态图标
const ora = require("ora");
// 花式打log
const symbols = require("log-symbols");
// 读取packgaejson
const packageConfig = require("../package.json");

program
  .version(packageConfig.version)
  .description("欢迎使用无星的cli进行初始化")
  .command("init <name>")
  .action(name => {
    // 这里拿到name了，判断当前文件夹下，是否有同名文件夹
    if (!fs.existsSync(name)) {
      // 不存在，开始创建
      // 需要交互的内容

      const promptList = [
        // 具体交互内容
        {
          name: "type",
          message: "vue:1;react:2"
        },
        {
          name: "description",
          message: "请输入项目描述"
        },
        {
          name: "author",
          message: "请输入作者名"
        }
      ];
      inquirer.prompt(promptList).then(answers => {
        // 判断类型，下载不同类型模板
        const { type, description, author } = answers;
        let url = "";
        if (type === "1") {
          console.log("正在拉取vue项目模板");
          url = "https://gitee.com:wuxinggg/vue-template#master";
        } else {
          console.log("正在拉取react项目模板");
          url = "https://gitee.com:wuxinggg/react-template#master";
        }
        const spinner = ora("download...");
        spinner.start();
        download(url, name, { clone: true }, err => {
          // 判断是否存在错误
          if (err) {
            // 下载失败，展示原因
            spinner.fail();
            console.log(chalk.red(err));
          } else {
            // 下载成功
            spinner.succeed();
            const fileName = name + "/package.json";
            const meta = {
              name,
              description,
              author
            };
            // 判断路径
            if (fs.existsSync(fileName)) {
              // 写入数据
              const content = fs.readFileSync(fileName).toString();
              const result = handlebars.compile(content)(meta);
              fs.writeFileSync(fileName, result);
            }
            console.log(chalk.green("success"));
            console.log(chalk.magenta(`${name}创建成功, 执行下面命令启动项目`));
            console.log(chalk.magenta(` cd ${name}`));
            console.log(chalk.magenta(" npm install"));
            console.log(chalk.magenta(" npm start"));
          }
        });
      });
    } else {
      // 存在，直接报错
      console.log(symbols.error, chalk.red("项目已存在"));
    }
  });
program.parse(process.argv);
