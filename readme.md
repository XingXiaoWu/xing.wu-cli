# @xing.wu/cli

# 代码相关
```
.
├── node_modules                    
├── package.json                    
├── pnpm-lock.yaml
├── readme.md                       
└── src                             代码主体
    ├── actions                     操作的action
    │   └── init.js                     initAction
    ├── config                      配置文件
    │   └── templates.json              模板列表
    |   └── hooks                       添加git hooks的默认配置文件
    ├── index.js                    入口文件
    └── utils                       工具类
        ├── downTemplate.js             下载模板
        ├── exit.js                     退出
        ├── log.js                      颜色打印
        └── spinner.js                  loading实例
```

# 使用方法
## 安装(不推荐安装，建议npx使用)
```
npm install @xing.wu/cli -g
```

## 新建项目(推荐使用npx)
```bash
# npx使用
npx @xing.wu/cli init 项目名
# 例如
npx @xing.wu/cli init aaa
npx @xing.wu/cli i aaa
# 安装后使用
@xing.wu/cli init aaa
@xing.wu/cli i aaa
```

## 获取版本号
```bash
@xing.wu/cli --version
@xing.wu/cli -V
```

## 获取帮助信息
```
@xing.wu/cli --help
```

## 已有项目添加git hook
```
@xing.wu/cli add git hooks
npx @xing.wu/cli add git hooks
```


# 调试相关
1.
```
pnpm link --global
```

2.`/src/index.js`第一行修改为
```
#!/usr/bin/env node --inspect-brk
```

3.在命令行中执行相应命令，等启动以后，使用`vscode`启动`手动链接到测试任务`

4.卸载全局任务
```
pnpm remove @xing.wu/cli -g
```