# Gizmo Ball React

一个简单 2D 物理的弹球游戏。内容来源于ECNU 2019第一学年 SE课程《面向对象设计与分析》作业。

在线实例:<https://darrendanielday.github.io/gizmo-ball-react>

此项目是基于[`Vue 2.x`](https://cn.vuejs.org/v2/guide/)和[`electron`](https://www.electronjs.org/)的旧[桌面版项目](https://github.com/Discreater/gizmoBall)使用[`React 17`](https://reactjs.org)的 Web 重构版。


与旧项目相比的不同点：

- 平台迁移：从桌面应用程序变成Web Page
- 编程风格转变：摒弃了面向对象编程而采用函数式编程，摒弃了`mutable`而禁止所有对象属性修改
- 源代码减少：除去注释的有效逻辑总代码量减少约`21%`(`2946 lines` -> `2341 lines`)
- 执行性能提升：`React模式`下性能提升 `10倍`以上，`DOM模式`下性能提升 `20倍`以上
- 内存占用减少：不会再因小球数量增多而飙升到`4G`以上，即使大半个屏幕放满小球也能稳定在`30MB`以下
- 功能完善：优化拖拽放置操作，增加点击放置功能，增加快捷键旋转缩放删除功能
- 规则改变：在轨道的内部，小球仍然受到重力影响，速度不会因规则保持不变

---

以下是开发相关

---

> ✨ Bootstrapped with Create Snowpack App (CSA).

## Available Scripts

### npm start

Runs the app in the development mode.
Open http://localhost:8080 to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### npm run build

Builds a static copy of your site to the `build/` folder.
Your app is ready to be deployed!

**For the best production performance:** Add a build bundler plugin like "@snowpack/plugin-webpack" to your `snowpack.config.mjs` config file.

### npm test

Launches the application test runner.
Run with the `--watch` flag (`npm test -- --watch`) to run in interactive watch mode.
