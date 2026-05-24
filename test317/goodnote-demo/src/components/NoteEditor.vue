<template>
  <div class="note-editor h-full flex flex-col bg-white dark:bg-gray-800">
    <!-- 编辑器标题 -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <input
        v-model="noteTitle"
        type="text"
        placeholder="输入笔记标题..."
        class="w-full text-xl font-semibold bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400"
        @input="handleTitleChange"
      />
    </div>

    <!-- Vditor 编辑器容器 -->
    <div ref="vditorRef" class="flex-1 overflow-hidden"></div>

    <!-- 底部状态栏 -->
    <div class="p-3 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 flex justify-between items-center">
      <span>{{ wordCount }} 字</span>
      <span v-if="lastSaved">{{ lastSaved }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import { useNotesStore } from '../composables/useNotes.js'

const props = defineProps({
  note: {
    type: Object,
    default: null
  },
  darkMode: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update'])

const notesStore = useNotesStore()
const vditorRef = ref(null)
const noteTitle = ref('')
const lastSaved = ref('')
let vditor = null
let saveTimeout = null

// 初始化 Vditor
onMounted(() => {
  vditor = new Vditor(vditorRef.value, {
    height: '100%',
    mode: 'wysiwyg', // 所见即所得模式，编辑体验更稳定
    theme: props.darkMode ? 'dark' : 'classic',
    lang: 'zh_CN',
    placeholder: '开始输入内容，支持 Markdown 语法...',
    cache: {
      enable: false
    },
    code: {
      lineNums: false,
      hintMarkdown: false
    },
    preview: {
      hljs: {
        enable: true,
        lineNumber: false,
        style: 'github-dark'
      }
    },
    outline: {
      enable: false // 禁用大纲
    },
    input: (value) => {
      handleContentChange(value)
    },
    after: () => {
      if (props.note?.content) {
        vditor.setValue(props.note.content)
      }
      // 聚焦编辑器
      vditor.focus()
      // 禁用代码���编辑弹窗
      disableCodeBlockEdit() 
    }
  })
})

// 禁用代码块编辑弹窗
const disableCodeBlockEdit = () => {
  const editor = vditorRef.value
  if (!editor) return

  // 使用 MutationObserver 监听 DOM 变化，移除任何出现的编辑弹窗
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          // 检查是否是代码编辑弹窗
          const element = node
          if (element.classList &&
              (element.classList.contains('vditor-code') ||
               element.classList.contains('vditor-suggest') ||
               element.classList.contains('vditor-toaster') ||
               element.id?.includes('code'))) {
            element.remove()
          }
          // 检查子元素
          const codeElements = element.querySelectorAll?.('[class*="code"]')
          codeElements?.forEach((el) => {
            if (el.classList.contains('vditor-code') ||
                el.classList.contains('vditor-suggest')) {
              el.remove()
            }
          })
        }
      })
    })
  })

  observer.observe(editor, {
    childList: true,
    subtree: true
  })

  // 只拦截双击代码块的事件，而不是所有点击
  editor.addEventListener('dblclick', (e) => {
    const pre = e.target.closest('pre')
    if (pre) {
      e.preventDefault()
      e.stopPropagation()
    }
  }, true)

  // 拦截右键点击代码块的事件
  editor.addEventListener('contextmenu', (e) => {
    const pre = e.target.closest('pre')
    if (pre) {
      e.preventDefault()
      e.stopPropagation()
    }
  }, true)
}

// 字数统计
const wordCount = computed(() => {
  if (!vditor) return 0
  const content = vditor.getValue()
  if (!content) return 0
  return content.replace(/\s/g, '').length
})

// 处理标题变化
const handleTitleChange = () => {
  if (props.note) {
    notesStore.updateNote(props.note.id, { title: noteTitle.value })
  }
  updateLastSaved()
}

// 处理内容变化
const handleContentChange = (value) => {
  if (props.note) {
    notesStore.updateNote(props.note.id, { content: value })
  }
  updateLastSaved()
}

// 更新最后保存时间
const updateLastSaved = () => {
  lastSaved.value = `已保存 ${new Date().toLocaleTimeString('zh-CN')}`
}

// 监听笔记变化
watch(() => props.note, (newNote) => {
  if (newNote) {
    if (noteTitle.value !== newNote.title) {
      noteTitle.value = newNote.title
    }
    if (vditor && vditor.getValue() !== newNote.content) {
      vditor.setValue(newNote.content || '')
    }
  }
}, { deep: true, immediate: true })

// 监听主题变化
watch(() => props.darkMode, (isDark) => {
  if (vditor) {
    vditor.setTheme(isDark ? 'dark' : 'classic')
  }
})

// 组件销毁前清理
onBeforeUnmount(() => {
  if (vditor) {
    vditor.destroy()
    vditor = null
  }
})

// 暴露方法
defineExpose({
  focus: () => {
    if (vditor) {
      vditor.focus()
    }
  }
})
</script>

<style>
/* Vditor 容器样式调整 */
.note-editor .vditor {
  border: none;
  background: transparent;
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
}

.note-editor .vditor-toolbar {
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.dark .note-editor .vditor-toolbar {
  border-bottom-color: #374151;
  background: #1f2937;
}

/* 隐藏编辑器底部的工具栏 */
.note-editor .vditor-foot {
  display: none;
}

/* 编辑器内容左对齐 */
.note-editor .vditor-ir {
  text-align: left !important;
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
  display: block !important;
}

.note-editor .vditor-ir .vditor-reset {
  text-align: left !important;
  padding-left: 10px !important;
  padding-right: 10px !important;
  padding-top: 10px !important;
  padding-bottom: 10px !important;
  margin: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  display: block !important;
  box-sizing: border-box !important;
}

.note-editor .vditor-content {
  padding-left: 0 !important;
  padding-right: 0 !important;
  margin: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
}

.note-editor .vditor-ir .vditor-wysiwyg {
  padding-top: 0 !important;
  margin-top: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  padding: 0 !important;
}

.note-editor .vditor-ir .vditor-wysiwyg .vditor-reset {
  margin-left: 0 !important;
  margin-right: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
}

/* 强制移除所有可能居中的样式 */
.note-editor .vditor *,
.note-editor .vditor-ir *,
.note-editor .vditor-content * {
  box-sizing: border-box !important;
}

.note-editor .vditor-ir > div,
.note-editor .vditor-content > div {
  width: 100% !important;
  max-width: 100% !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
}

/* 行号样式 - 白色 */
.note-editor .hljs-ln-numbers {
  color: #ffffff !important;
  background-color: transparent !important;
  border-right: 1px solid rgba(255, 255, 255, 0.1) !important;
  padding-right: 10px !important;
  user-select: none !important;
}

.note-editor .hljs-ln-line {
  display: flex !important;
}

.note-editor .hljs-ln-code {
  padding-left: 10px !important;
}

/* 确保编辑器窗口不会被遮挡 */
.note-editor .vditor-toaster {
  display: none !important;
}

/* 防止代码块被选中后出现编辑提示 */
.note-editor .vditor-ir pre *::before,
.note-editor .vditor-ir pre *::after {
  content: none !important;
}

/* 隐藏所有可能的编辑弹窗和工具栏 */
.note-editor .vditor-toolbar,
.note-editor .vditor-hint,
.note-editor .vditor-wysiwyg__toolbar,
.note-editor [class*="code"][class*="toolbar"],
.note-editor [class*="code"][class*="editor"],
.note-editor [class*="code"][class*="input"],
.note-editor [class*="code"][class*="popup"],
.note-editor [class*="code"][class*="modal"],
.note-editor [class*="vditor-hint"],
.note-editor .vditor-wysiwyg > .vditor-reset > [class*="toolbar"],
.note-editor .vditor-content > [class*="toolbar"] {
  display: none !important;
  opacity: 0 !important;
  visibility: hidden !important;
}

/* 隐藏右侧所有弹窗 */
.note-editor .vditor-popover,
.note-editor .vditor-tooltip,
.note-editor .vditor-dialog,
.note-editor .vditor-modal {
  display: none !important;
}

/* 确保代码块可以正常编辑 */
.note-editor .vditor-ir pre code,
.note-editor .vditor-wysiwyg pre code {
  cursor: text !important;
}

/* 确保编辑器内容区域占满整个容器 */
.note-editor .vditor-wysiwyg {
  width: 100% !important;
  max-width: 100% !important;
}

.note-editor .vditor-wysiwyg .vditor-reset {
  width: 100% !important;
  max-width: 100% !important;
  padding: 10px !important;
}

/* 隐藏预览区域和其他编辑窗口 */
.note-editor .vditor-preview,
.note-editor .vditor-sv,
.note-editor .vditor-ir,
.note-editor .vditor-textarea,
.note-editor .vditor-split,
.note-editor .vditor-split__block,
.note-editor .vditor-split__editor,
.note-editor .vditor-split__preview {
  display: none !important;
}

/* 只显示 wysiwyg 编辑器 */
.note-editor .vditor-content .vditor-wysiwyg {
  display: block !important;
}
</style>