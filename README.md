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

## 部署注意事项

1. 环境变量配置：
   - \`NEXT_PUBLIC_BASE_URL\`: 网站域名

2. 静态资源：
   - 确保 \`public/images\` 目录包含所有文章封面图片
   - 图片建议尺寸：800x600 像素

3. 服务器要求：
   - Node.js 18.x 或更高版本
   - 支持 Next.js 部署的环境（如 Vercel、腾讯云等）

## 待开发功能

- [ ] 文章标签系统
- [ ] 搜索功能
- [ ] 评论系统
- [ ] 文章归档
- [ ] RSS 订阅

## 许可证

MIT License
