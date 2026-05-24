# GoodNote - AI 笔记应用 Demo

一款现代化的 AI 笔记应用，结合了强大的 Markdown 编辑器和智能 AI 助手。

## 功能特性

### ✨ 核心功能
- 📝 **Markdown 编辑** - 基于 CodeMirror 6 的强大编辑器
- 👁️ **实时预览** - 即时查看 Markdown 渲染效果
- 💾 **自动保存** - 所有更改自动保存到浏览器本地存储
- 🔍 **搜索功能** - 快速搜索笔记标题和内容
- 🌙 **深色模式** - 支持深色/浅色主题切换

### 🤖 AI 功能
- **总结笔记** - 一键生成笔记摘要
- **扩展内容** - 基于现有内容扩展更多细节
- **改写优化** - 专业或简洁风格改写

## 技术栈

- **前端框架**: Vue 3 + Composition API
- **状态管理**: Pinia
- **编辑器**: CodeMirror 6
- **样式**: Tailwind CSS
- **Markdown 解析**: marked.js + DOMPurify
- **AI 服务**: Claude (Anthropic) API
- **构建工具**: Vite

## 安装和运行

### 1. 安装依赖

```bash
cd goodnote-demo
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动。

### 3. 构建生产版本

```bash
npm run build
```

### 4. 预览生产版本

```bash
npm run preview
```

## 使用说明

### 基本操作

1. **创建笔记** - 点击左侧边栏的"新建笔记"按钮
2. **编辑笔记** - 在中间编辑器中输入 Markdown 内容
3. **预览效果** - 右侧面板实时显示渲染效果
4. **切换笔记** - 点击左侧笔记列表中的笔记

### AI 功能使用

1. **配置 API Key**
   - 点击右上角的 AI 助手图标
   - 输入您的 Claude API Key
   - 点击保存

   > 获取 API Key: [Anthropic Console](https://console.anthropic.com/)

2. **使用 AI 功能**
   - **总结笔记**: 点击"总结笔记"按钮生成摘要
   - **扩展内容**: 点击"扩展内容"按钮丰富笔记内容
   - **改写**: 选择"改写（专业）"或"改写（简洁）"按钮

### 主题切换

点击右上角的太阳/月亮图标切换深色/浅色模式。

## 项目结构

```
goodnote-demo/
├── index.html              # HTML 入口
├── package.json            # 项目配置
├── vite.config.js          # Vite 配置
├── tailwind.config.js      # Tailwind 配置
└── src/
    ├── main.js             # 应用入口
    ├── App.vue             # 根组件
    ├── components/         # 组件
    │   ├── NoteList.vue        # 笔记列表
    │   ├── NoteEditor.vue      # 编辑器
    │   ├── NotePreview.vue     # 预览面板
    │   ├── AIAssistant.vue     # AI 助手
    │   └── ThemeToggle.vue     # 主题切换
    ├── composables/        # 组合式函数
    │   ├── useNotes.js         # 笔记管理
    │   └── useAI.js            # AI 功能
    └── styles/             # 样式
        └── main.css            # 全局样式
```

## 数据存储

所有笔记数据都保存在浏览器的 `localStorage` 中，无需后端服务器。

### 数据结构

```javascript
{
  id: "唯一标识符",
  title: "笔记标题",
  content: "Markdown 内容",
  createdAt: "创建时间",
  updatedAt: "更新时间"
}
```

## 浏览器支持

- Chrome/Edge (最新版本)
- Firefox (最新版本)
- Safari (最新版本)

## 安全说明

- 您的 Claude API Key 只保存在浏览器本地存储中
- 不会上传到任何第三方服务器
- 请妥善保管您的 API Key

## 后续扩展

计划中的功能：

- [ ] 文件夹管理
- [ ] 标签系统
- [ ] 导入/导出 Markdown 文件
- [ ] 更多 AI 功能（问答、翻译等）
- [ ] 后端 API 支持
- [ ] 桌面应用（Electron）

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

---

**享受使用 GoodNote！** 📝✨
