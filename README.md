# 拾猫记

《拾猫记》是一个以养猫陪伴为主题的静态前端 App 原型。用户收养一只流浪猫，通过阅读计时、日程待办、笔记、闹钟等功能获得代币，再购买食物或玩具与猫互动。

## 当前结构

```text
app/        当前可运行的静态 App
docs/       产品说明、UI 规范、PRD、路线图和访谈资料
archive/    历史快照、旧版单文件 HTML 和压缩包
```

## 运行方式

直接用浏览器打开：

```text
app/index.html
```

当前 App 不依赖构建工具，也没有 npm 安装步骤。浏览器本地数据保存在 `localStorage` 的 `mi_state` 中。

## 主要文件

```text
app/index.html              页面结构
app/styles/main.css         视觉样式、动效和夜间模式
app/scripts/app.js          交互逻辑和本地状态
app/assets/images/          当前运行所需图片资源
```

## 历史版本

```text
archive/snapshots/2026-05-19/
archive/snapshots/2026-05-26/
archive/snapshots/2026-06-02/
archive/previous-html/versions/
```
