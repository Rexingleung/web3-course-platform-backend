# Web3 Course Platform - Backend

这是一个基于智能合约的课程平台后端服务，使用 Node.js + Express + TypeScript + MySQL 构建。

## 功能特性

- 🔗 与智能合约集成，同步课程数据
- 📊 用户购买课程记录
- 🎓 课程管理和查询
- 👨‍🏫 作者课程管理
- 🗄️ MySQL 数据库存储
- 🚀 RESTful API 接口

## 技术栈

- Node.js + Express
- TypeScript
- MySQL2
- Ethers.js (Web3)
- CORS

## 快速开始

### 环境要求

- Node.js 16+
- MySQL 5.7+
- 智能合约已部署

### 1. 安装依赖

```bash
npm install
```

### 2. 环境配置

复制 `.env.example` 为 `.env` 并配置：

```env
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=&*&Ddasd123.ii2
DB_NAME=web3
CONTRACT_ADDRESS=0xdDD30BD07C402eE78079c35A7DE2F9232ed54Aa4
RPC_URL=http://localhost:8545
```

### 3. 数据库初始化

确保 MySQL 服务运行，然后执行：

```bash
npm run migrate
```

### 4. 启动开发服务器

```bash
npm run dev
```

服务将运行在 http://localhost:3001

### 5. 构建生产版本

```bash
npm run build
npm start
```

## API 接口

### 课程相关

- `GET /api/courses` - 获取所有课程
- `GET /api/courses/:id` - 获取指定课程
- `GET /api/courses/count` - 获取课程总数
- `GET /api/courses/author/:author` - 获取作者的课程
- `POST /api/courses/sync` - 同步智能合约数据

### 购买相关

- `GET /api/courses/purchased/:userAddress` - 获取用户购买的课程
- `GET /api/courses/purchased/:courseId/:userAddress` - 检查购买状态
- `POST /api/courses/purchase` - 记录购买交易

### 健康检查

- `GET /health` - 服务状态检查

## 数据库结构

### courses 表

- `id` - 自增主键
- `course_id` - 智能合约中的课程ID
- `title` - 课程标题
- `description` - 课程描述
- `author` - 作者地址
- `price` - 课程价格（wei）
- `created_at` - 创建时间戳
- `updated_at` - 更新时间

### purchases 表

- `id` - 自增主键
- `course_id` - 课程ID
- `buyer` - 购买者地址
- `price` - 购买价格
- `transaction_hash` - 交易哈希
- `purchased_at` - 购买时间

## 智能合约集成

后端服务通过 ethers.js 与智能合约交互：

- 合约地址：`0xdDD30BD07C402eE78079c35A7DE2F9232ed54Aa4`
- 支持读取课程信息
- 支持查询用户购买记录
- 自动同步合约数据到数据库

## 开发说明

### 项目结构

```
src/
├── controllers/     # 控制器
├── services/       # 业务逻辑服务
├── routes/         # 路由配置
├── database/       # 数据库配置
├── contracts/      # 智能合约交互
├── types/          # TypeScript 类型定义
└── index.ts        # 应用入口
```

### 脚本命令

- `npm run dev` - 开发模式运行
- `npm run build` - 构建项目
- `npm start` - 生产模式运行
- `npm run migrate` - 数据库迁移

## 部署指南

### Docker 部署

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

### 环境变量

确保生产环境配置正确的环境变量：

- `PORT` - 服务端口
- `DB_HOST` - 数据库主机
- `DB_USER` - 数据库用户
- `DB_PASSWORD` - 数据库密码
- `DB_NAME` - 数据库名称
- `CONTRACT_ADDRESS` - 智能合约地址
- `RPC_URL` - 区块链RPC地址

## 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查 MySQL 服务状态
   - 验证数据库凭据
   - 确保数据库已创建

2. **智能合约连接失败**
   - 检查 RPC_URL 配置
   - 验证合约地址
   - 确保网络可达

3. **CORS 问题**
   - 检查前端域名配置
   - 确保 CORS 中间件正确设置

### 日志调试

开发模式下查看详细日志：

```bash
npm run dev
```

生产模式使用 PM2：

```bash
pm2 start dist/index.js --name web3-course-backend
pm2 logs web3-course-backend
```

## 安全建议

- 使用环境变量存储敏感信息
- 启用 HTTPS
- 实施API速率限制
- 定期更新依赖包
- 监控系统资源使用

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License