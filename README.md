# FPS 训练游戏

这是一个数字序列记忆游戏，玩家需要按顺序点击数字。测试并提高您的反应时间和记忆力。

## 功能特点

- 不同的网格大小（4×4、5×5、6×6）
- 计时器跟踪您的完成时间
- 色彩丰富的视觉设计，便于数字识别
- 简单直观的界面

## 技术栈

- [Next.js 15](https://nextjs.org/) 使用 App Router
- [React 19](https://react.dev/)
- [Bun](https://bun.sh/) 作为 JavaScript 运行时
- [Tailwind CSS v4](https://tailwindcss.com/) 用于样式设计
- [Biome](https://biomejs.dev/) 用于代码格式化和检查
- [Husky](https://typicode.github.io/husky/) 用于 Git 钩子

## 项目结构

```
src/
├── app/            # Next.js App Router 页面
│   └── page.tsx    # 主游戏组件
├── hooks/          # 自定义 React 钩子
│   ├── useColors.ts   # 生成按钮颜色的钩子
│   ├── useGame.ts     # 主游戏逻辑钩子
│   └── useTimer.ts    # 计时器功能钩子
```

## 开始使用

### 前提条件

- [Bun](https://bun.sh/) (>= 1.0.0)

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
# 启动开发服务器
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

## 许可证

[MIT](LICENSE)
