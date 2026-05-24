<template>
  <div class="app h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
    <!-- 顶部导航栏 -->
    <header class="h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2">
          <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <h1 class="text-lg font-bold text-gray-900 dark:text-gray-100">GoodNote</h1>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <!-- AI 助手按钮 -->
        <button
          @click="showAI = !showAI"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          :class="{ 'bg-primary-100 dark:bg-primary-900/30 text-primary-600': showAI }"
          title="AI 助手"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>
        </button>

        <!-- 主题切换 -->
        <ThemeToggle @toggle="handleThemeToggle" />
      </div>
    </header>

    <!-- 主内容区 -->
    <div class="flex-1 flex overflow-hidden relative">
      <!-- 左侧笔记列表 -->
      <div class="w-80 flex-shrink-0">
        <NoteList @create="handleCreateNote" @select="handleSelectNote" />
      </div>

      <!-- 编辑器区域 -->
      <div class="flex-1 min-w-0 relative">
        <NoteEditor v-if="currentNote" ref="editorRef" :note="currentNote" :dark-mode="isDark" @update="handleUpdateNote" />
        <div v-else class="h-full flex items-center justify-center bg-white dark:bg-gray-800">
          <div class="text-center text-gray-400 dark:text-gray-600">
            <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p class="text-lg mb-2">选择或创建一个笔记开始编辑</p>
            <p class="text-sm">支持 Markdown 语法，实时高亮显示</p>
          </div>
        </div>

        <!-- AI 助手面板（浮动，右上角） -->
        <Transition name="slide">
          <div v-if="showAI && currentNote" class="absolute top-4 right-4 w-96 max-h-[80vh] overflow-y-auto z-20 shadow-2xl">
            <AIAssistant :note="currentNote" @replace="handleReplaceContent" />
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useNotesStore } from './composables/useNotes.js'
import NoteList from './components/NoteList.vue'
import NoteEditor from './components/NoteEditor.vue'
import AIAssistant from './components/AIAssistant.vue'
import ThemeToggle from './components/ThemeToggle.vue'

const notesStore = useNotesStore()
const editorRef = ref(null)
const showAI = ref(false)
const isDark = ref(false)

// 当前笔记
const currentNote = computed(() => notesStore.currentNote)

// 处理创建笔记
const handleCreateNote = (note) => {
  console.log('创建笔记:', note)
}

// 处理选择笔记
const handleSelectNote = (id) => {
  console.log('选择笔记:', id)
}

// 处理更新笔记
const handleUpdateNote = () => {
  // 笔记更新已在编辑器组件中处理
}

// 处理主题切换
const handleThemeToggle = (dark) => {
  isDark.value = dark
}

// 处理 AI 替换内容
const handleReplaceContent = (content) => {
  if (currentNote.value) {
    notesStore.updateNote(currentNote.value.id, { content })
  }
}

// 初始化
onMounted(() => {
  // 如果没有笔记，创建一个欢迎笔记
  if (notesStore.notes.length === 0) {
    const welcomeNote = notesStore.createNote()
    notesStore.updateNote(welcomeNote.id, {
      title: '欢迎使用 GoodNote',
      content: `# 欢迎使用 GoodNote 👋

GoodNote 是一款现代化的 AI 笔记应用，结合了强大的编辑器和智能 AI 助手。

## 主要功能

### 📝 Markdown 编辑
- **语法高亮**：实时高亮显示 Markdown 语法
- **自动保存**：所有更改自动保存到浏览器本地存储
- **深色模式**：支持深色/浅色主题切换

### 🤖 AI 助手
- **总结笔记**：一键生成笔记摘要
- **扩展内容**：基于现有内容扩展更多细节
- **改写优化**：专业或简洁风格改写

## 快速开始

1. 点击左侧 **"新建笔记"** 按钮创建新笔记
2. 在编辑器中输入 Markdown 内容，语法会实时高亮显示
3. 点击右上角 **AI 助手** 按钮体验 AI 功能

## 配置 Claude API

要使用 AI 功能，您需要配置 Claude API Key：

1. 访问 [Anthropic Console](https://console.anthropic.com/)
2. 创建 API Key
3. 点击应用右上角的 AI 助手图标
4. 输入您的 API Key

---

**提示**：您的 API Key 只保存在浏览器本地，不会上传到任何服务器。

开始您的笔记之旅吧！🚀`
    })
  }
})
</script>

<style>
/* 动画 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* 隐藏滚动条但保持可滚动 */
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>
