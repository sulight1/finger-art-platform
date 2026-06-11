# 指尖造物 (Finger-Art-Platform)

一个专为年轻女性打造的垂直类 C2C 手作定制与技能交换平台。

## 核心功能

- **造物市集**: 浏览和购买各类手作成品（钩织、滴胶、穿戴甲等）。
- **定制大厅**: 发布个性化定制需求，与手作娘直接沟通。
- **技能交换**: 独创“造物币”机制，支持无金钱流转的技能互换。
- **智能排期**: 手艺人可视化时间管理，自动校验预约冲突。
- **信用体系**: 双向评价，严厉打击跑单行为（扣分、限权、封禁）。

## 技术栈

- **前端**: Vue 3, TypeScript, Vite, Ant Design Vue, Pinia.
- **后端**: NestJS, TypeORM, SQLite (开发环境), JWT, Passport.

## 如何运行

### 后端 (Server)
1. 进入 `server` 目录: `cd server`
2. 安装依赖: `npm install`
3. 启动开发服务器: `npm run start:dev` (或 `node dist/main.js` 如果已构建)

### 前端 (Client)
1. 进入 `client` 目录: `cd client`
2. 安装依赖: `npm install`
3. 启动开发服务器: `npm run dev`

## 项目结构

- `server/src/entities`: 数据库模型定义 (User, Product, Order, SkillExchange, etc.)
- `server/src/auth`: 身份验证与权限控制
- `server/src/orders`: 订单状态流转与风控逻辑
- `server/src/skill-exchange`: 技能交换与造物币结算
- `client/src/views`: 前端主要页面 (首页、市集、技能交换、登录)
