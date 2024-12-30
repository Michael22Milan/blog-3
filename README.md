# Skywalker79 个人博客

这是一个使用 Next.js 14 构建的个人博客网站，采用了现代化的设计风格和最佳实践。

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS + CSS Modules
- **内容管理**: Markdown
- **UI组件**: 
  - `next/image` - 图片优化
  - `marked` - Markdown 渲染
  - `gray-matter` - Markdown 元数据解析
- **开发工具**: 
  - ESLint - 代码检查
  - Prettier - 代码格式化
  - TypeScript - 类型检查

## 项目结构

```
blog-3/
├── app/                    # Next.js 应用目录
│   ├── api/               # API 路由
│   │   └── posts/        # 文章相关 API
│   ├── posts/            # 文章相关页面
│   │   └── [slug]/      # 文章详情页
│   ├── contact/          # 联系方式页面
│   └── page.tsx          # 首页
├── content/              # 内容目录
│   └── posts/           # Markdown 文章
├── lib/                  # 工具函数
│   └── posts.ts         # 文章处理函数
├── public/              # 静态资源
│   └── images/         # 图片资源
└── types/               # TypeScript 类型定义
```

## 功能特性

### 1. 博客文章管理
- Markdown 格式文章支持
- 文章元数据管理（标题、日期、摘要、封面图）
- 按日期自动排序
- 响应式图片画廊展示

### 2. 页面布局
- 响应式设计
- 画廊视图（首页）
- 列表视图（文章列表页）
- 文章详情页
- 联系方式页面

### 3. 用户界面
- 现代化的卡片设计
- 平滑的过渡动画
- 悬停效果
- 渐变色文字
- 自适应图片展示

### 4. 性能优化
- 图片自动优化
- 增量静态再生成 (ISR)
- 组件级缓存
- 响应式图片加载

## 文章格式

文章使用 Markdown 格式，需要包含以下前置元数据：

\`\`\`markdown
---
title: 文章标题
date: 'YYYY-MM-DD'
excerpt: 文章摘要
coverImage: /images/example.jpg
---

文章内容...
\`\`\`

## 开发指南

1. 安装依赖：
\`\`\`bash
npm install
\`\`\`

2. 启动开发服务器：
\`\`\`bash
npm run dev
\`\`\`

3. 构建生产版本：
\`\`\`bash
npm run build
\`\`\`

## 部署指南

### 轻量化服务器部署方案

本项目使用腾讯云轻量化服务器进行部署，采用 Ubuntu + Nginx + PM2 的架构方案。

#### 服务器环境准备

1. 系统选择：Ubuntu 22.04 LTS
   - 更好的软件包支持
   - 更新的系统组件
   - 完善的包管理系统

2. 运行环境安装：
   ```bash
   # 安装 Node.js 18.x LTS
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # 安装 Nginx
   sudo apt-get install nginx

   # 安装 PM2
   sudo npm install -y pm2 -g

   # 安装 MongoDB（如果选择本地数据库）
   sudo apt-get install -y mongodb
   ```

#### 部署步骤

1. 代码部署：
   ```bash
   # 创建应用目录
   sudo mkdir -p /var/www/blog
   sudo chown -R $USER:$USER /var/www/blog

   # 拉取代码
   git clone <your-repo-url> /var/www/blog
   cd /var/www/blog

   # 安装依赖并构建
   npm install
   npm run build
   ```

2. PM2 配置：
   ```bash
   # 创建 ecosystem.config.js
   module.exports = {
     apps: [{
       name: 'blog',
       script: 'npm',
       args: 'start',
       env: {
         NODE_ENV: 'production',
         PORT: 3000
       }
     }]
   }

   # 启动应用
   pm2 start ecosystem.config.js
   ```

3. Nginx 配置：
   ```nginx
   server {
     listen 80;
     server_name your-domain.com;

     location / {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

#### 域名配置

1. DNS 解析配置：
   - 添加 A 记录指向服务器 IP
   - 添加 www 记录指向主域名

2. SSL 证书配置：
   ```bash
   # 安装 Certbot
   sudo apt-get install certbot python3-certbot-nginx

   # 申请证书
   sudo certbot --nginx -d your-domain.com -d www.your-domain.com
   ```

#### 数据库选择

1. 本地 MongoDB：
   - 适合小型博客
   - 便于管理和备份
   - 无额外成本

2. MongoDB Atlas：
   - 更好的可扩展性
   - 自动备份
   - 专业的监控工具
   - 有一定月费

#### 维护与监控

1. 日常维护：
   ```bash
   # 查看应用状态
   pm2 status
   pm2 logs

   # 更新代码
   git pull
   npm install
   npm run build
   pm2 restart blog

   # 系统更新
   sudo apt update
   sudo apt upgrade
   ```

2. 备份策略：
   - 代码备份：GitHub 仓库
   - 数据库备份：每日自动备份
   - 文件备份：定期备份 uploads 目录

3. 监控方案：
   - PM2 监控：`pm2 monit`
   - Nginx 访问日志
   - 系统资源监控

#### 性能优化

1. 服务器优化：
   - 配置 Nginx 缓存
   - 启用 Gzip 压缩
   - 优化系统参数

2. 应用优化：
   - 启用页面缓存
   - 图片 CDN 加速
   - 静态资源优化

#### 安全措施

1. 系统安全：
   - 定期更新系统
   - 配置防火墙
   - 禁用密码登录，使用 SSH 密钥

2. 应用安全：
   - 启用 HTTPS
   - 配置安全头
   - 限制上传文件类型

3. 数据安全：
   - 定期备份
   - 数据加密
   - 访问控制

## 待开发功能

- [ ] 文章标签系统
- [ ] 搜索功能
- [ ] 评论系统
- [ ] 文章归档
- [ ] RSS 订阅

## 许可证

MIT License
