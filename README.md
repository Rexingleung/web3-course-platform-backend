# Web3 Course Platform - Backend

这是一个基于智能合约的课程平台后端服务，使用 Node.js + Express + TypeScript + MySQL 构建。

## 功能特性

- 🔗 与智能合约集成，同步课程数据
- 📊 用户购买课程记录
- 🎓 课程管理和查询
- 👨‍🏫 作者课程管理
- 🗄️ MySQL 数据库存储
- 🚀 RESTful API 接口
- 🔄 智能合约故障转移（数据库后备）

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
- 智能合约已部署（可选，有数据库后备）

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

### 3. 数据库初始化和种子数据

**选项 A: 完整设置（推荐）**
```bash
npm run setup
```

**选项 B: 分步骤设置**
```bash
# 创建数据库表
npm run migrate

# 插入测试数据
npm run seed
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

## 智能合约集成

后端服务通过 ethers.js 与智能合约交互：

- 合约地址：`0xdDD30BD07C402eE78079c35A7DE2F9232ed54Aa4`
- 支持读取课程信息
- 支持查询用户购买记录
- 自动同步合约数据到数据库
- **智能故障转移**：如果合约不可用，自动使用数据库后备

## 测试数据

运行 `npm run seed` 后，系统会插入以下测试数据：

### 示例课程
1. **Web3 开发入门** - 0.1 ETH
2. **DeFi 协议深度解析** - 0.2 ETH  
3. **NFT 市场开发实战** - 0.15 ETH
4. **Solidity 高级编程技巧** - 0.25 ETH
5. **Layer 2 扩容方案详解** - 0.18 ETH

### 示例用户地址
- `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
- `0x742d35Cc6634C0532925a3b8D65aEd2934C12D5e`

## 故障排除

### 常见问题

1. **数据库连接失败**
   ```bash
   # 检查 MySQL 服务状态
   sudo systemctl status mysql
   
   # 启动 MySQL（如需要）
   sudo systemctl start mysql
   ```

2. **"Database not initialized" 错误**
   ```bash
   # 重新运行迁移
   npm run migrate
   ```

3. **智能合约连接失败**
   - 系统会自动使用数据库后备
   - 检查 RPC_URL 配置
   - 验证合约地址

### 测试 API 端点

```bash
# 获取所有课程
curl http://localhost:3001/api/courses

# 获取特定用户的已购课程
curl http://localhost:3001/api/courses/purchased/0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

# 健康检查
curl http://localhost:3001/health
```

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

## 开发说明

### 项目结构

```
src/
├── controllers/     # 控制器
├── services/       # 业务逻辑服务
├── routes/         # 路由配置
├── database/       # 数据库配置
│   ├── connection.ts  # 数据库连接
│   ├── migrate.ts     # 数据库迁移
│   └── seed.ts        # 测试数据
├── contracts/      # 智能合约交互
├── types/          # TypeScript 类型定义
└── index.ts        # 应用入口
```

### 脚本命令

- `npm run dev` - 开发模式运行
- `npm run build` - 构建项目
- `npm start` - 生产模式运行
- `npm run migrate` - 数据库迁移
- `npm run seed` - 插入测试数据
- `npm run setup` - 完整初始化（迁移+种子数据）

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

## 架构特点

### 智能故障转移

系统设计了智能的故障转移机制：

1. **优先使用智能合约**：所有数据查询首先尝试从智能合约获取
2. **自动数据库后备**：当合约不可用时，自动切换到数据库查询
3. **数据同步**：合约可用时自动同步数据到数据库
4. **无缝切换**：前端无需感知数据源变化

### 性能优化

- 数据库连接池
- 合约调用缓存
- 错误重试机制
- 连接状态监控

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

MIT License"