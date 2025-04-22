# FPS 训练游戏

这是一个数字序列记忆游戏，玩家需要按顺序点击数字。测试并提高您的反应时间和记忆力。

## 功能特点

- 不同的网格大小（4×4、5×5、6×6）
- 计时器跟踪您的完成时间
- 色彩丰富的视觉设计，便于数字识别
- 简单直观的界面
- 用户认证系统（注册、登录和用户资料）
- 多语言支持（英语、中文、法语、德语、西班牙语）

## 技术栈

- [Next.js 15](https://nextjs.org/) 使用 App Router 和 Turbopack
- [React 19](https://react.dev/)
- [Bun](https://bun.sh/) 作为 JavaScript 运行时
- [Tailwind CSS v4](https://tailwindcss.com/) 用于样式设计
- [Biome](https://biomejs.dev/) 用于代码格式化和检查
- [Husky](https://typicode.github.io/husky/) 用于 Git 钩子
- [Shadcn UI](https://ui.shadcn.com) 作为 UI 库
- [Elysia](https://elysiajs.com/) (1.2.25) 用于 API 服务
- [Drizzle ORM](https://orm.drizzle.team/) 用于数据库操作
- [NeonDB](https://neon.tech/) 作为 Serverless PostgreSQL 数据库
- [Better Auth](https://github.com/better-auth/better-auth) 用于用户认证
- [React Hook Form](https://react-hook-form.com/) 用于表单处理
- [Zod](https://zod.dev/) 用于数据验证
- [Sonner](https://sonner.emilkowal.ski/) 用于通知提示

## 项目结构

```text
src/
├── app/            # Next.js App Router 页面
│   ├── page.tsx    # 主游戏组件
│   ├── layout.tsx  # 应用布局组件
│   └── api/        # API 路由
│       └── [[...slugs]]/  # 动态 API 路由
│           └── libs/auth/  # 认证相关处理
├── components/     # React 组件
│   ├── ui/         # UI 组件
│   ├── AuthDialog.tsx    # 认证对话框组件
│   ├── LoginForm.tsx     # 登录表单组件
│   ├── RegisterForm.tsx  # 注册表单组件
│   ├── LanguageDialog.tsx # 语言选择对话框
│   └── UserProfileButton.tsx # 用户资料按钮组件
├── contexts/       # React 上下文
│   └── LoginContext.tsx  # 登录状态上下文
├── hooks/          # 自定义 React 钩子
│   ├── useColors.ts  # 生成按钮颜色的钩子
│   ├── useGame.ts    # 主游戏逻辑钩子
│   ├── useTimer.ts   # 计时器功能钩子
│   ├── useLogin.ts   # 登录功能钩子
│   ├── useRegister.ts # 注册功能钩子
│   └── useLanguage.ts # 语言选择钩子
├── database/       # 数据库相关代码
│   ├── neon.ts     # NeonDB 连接
│   ├── schema.ts   # 数据库模式定义
│   ├── auth-schema.ts # 认证相关数据库模式
│   ├── model.ts    # 数据模型
│   └── utils.ts    # 数据库工具函数
├── lib/           # 工具库和辅助函数
│   ├── auth.ts     # 服务端认证配置
│   ├── auth-client.ts # 客户端认证工具
│   └── utils.ts    # 通用工具函数
└── services/      # 服务层代码
    ├── auth.service.ts # 认证服务
    └── eden.client.ts  # API 客户端
```

## 开始使用

### 前提条件

- [Bun](https://bun.sh/) (>= 1.2.7)

### 安装

```bash
# 克隆仓库
git clone https://github.com/your-username/fps-training.git
cd fps-training

# 安装依赖
bun install
```

### 开发

```bash
# 启动开发服务器 (使用 Turbopack)
bun run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看应用程序。

### 代码质量

项目使用 Biome 进行代码质量和格式化：

```bash
# 检查代码问题
bun run check

# 自动修复代码问题
bun run check:fix
```

### 提交前钩子

项目使用 Husky 在每次提交前运行检查：

- 提交前：运行 `check:fix` 确保代码质量
- 如果发现任何问题且无法自动修复，提交将被中止

## 如何游玩

1. 使用左上角的下拉菜单选择您喜欢的网格大小
2. 点击数字"1"开始游戏
3. 继续按顺序点击数字（1、2、3 等）
4. 尝试尽快完成序列
5. 如果点击错误的数字，游戏结束
6. 完成后，将显示您的用时

## 用户认证

1. 点击右上角的"登录 / 注册"按钮打开认证对话框
2. 选择"登录"标签输入您的邮箱和密码登录
3. 或选择"注册"标签创建新账户
4. 登录后，您的用户名将显示在右上角
5. 点击用户名可以打开下拉菜单，选择"退出登录"退出账户

## 语言设置

1. 点击右上角的语言图标按钮打开语言选择对话框
2. 从可用语言列表中选择您偏好的语言
3. 应用将保存您的语言偏好并在下次访问时自动应用

## 许可证

[MIT](LICENSE)
