<template>
  <div class="note-list h-full flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
    <!-- 头部 -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">笔记</h1>

      <!-- 搜索框 -->
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索笔记..."
          class="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
    </div>

    <!-- 新建笔记按钮 -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <button
        @click="handleCreateNote"
        class="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        新建笔记
      </button>
    </div>

    <!-- 笔记列表 -->
    <div class="flex-1 overflow-y-auto scrollbar-thin">
      <div v-if="filteredNotes.length === 0" class="p-8 text-center text-gray-400 dark:text-gray-600">
        <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <p>{{ searchQuery ? '没有找到匹配的笔记' : '还没有笔记，点击上方按钮创建' }}</p>
      </div>

      <div
        v-for="note in filteredNotes"
        :key="note.id"
        @click="handleSelectNote(note.id)"
        @contextmenu.prevent="handleContextMenu($event, note)"
        class="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors relative"
        :class="{ 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-l-primary-600': note.id === currentNoteId }"
      >
        <h3 class="font-medium text-gray-900 dark:text-gray-100 mb-1 truncate">{{ note.title }}</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">{{ getPreview(note.content) }}</p>
        <p class="text-xs text-gray-400 dark:text-gray-500">{{ formatDate(note.updatedAt) }}</p>
      </div>
    </div>

    <!-- 右键菜单 -->
    <div
      v-if="contextMenu.show"
      class="fixed bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 min-w-[160px]"
      :style="{ top: contextMenu.y + 'px', left: contextMenu.x + 'px' }"
      @click="closeContextMenu"
    >
      <button
        @click.stop="handleRename"
        class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
        </svg>
        重命名
      </button>
      <button
        @click.stop="handleDelete"
        class="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
        </svg>
        删除
      </button>
    </div>

    <!-- 重命名对话框 -->
    <div
      v-if="showRenameDialog"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="showRenameDialog = false"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md mx-4"
        @click.stop
      >
        <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">重命名笔记</h3>
        <input
          v-model="newTitle"
          type="text"
          placeholder="输入新的标题..."
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 mb-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
          @keyup.enter="confirmRename"
          ref="renameInputRef"
        />
        <div class="flex gap-3">
          <button
            @click="confirmRename"
            class="flex-1 py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
          >
            确定
          </button>
          <button
            @click="showRenameDialog = false"
            class="flex-1 py-2 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors"
          >
            取消
          </button>
        </div>
      </div>
    </div>

    <!-- 底部统计 -->
    <div class="p-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-400 dark:text-gray-500 flex justify-between">
      <span>共 {{ notes.length }} 篇笔记</span>
      <span v-if="searchQuery">找到 {{ filteredNotes.length }} 篇</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useNotesStore } from '../composables/useNotes.js'

const emit = defineEmits(['create', 'select'])

const notesStore = useNotesStore()
const searchQuery = ref('')

// 右键菜单状态
const contextMenu = ref({
  show: false,
  x: 0,
  y: 0,
  note: null
})

// 重命名对话框
const showRenameDialog = ref(false)
const newTitle = ref('')
const noteToDelete = ref(null)

// 获取笔记列表
const notes = computed(() => notesStore.sortedNotes)
const currentNoteId = computed(() => notesStore.currentNoteId)

// 过滤后的笔记
const filteredNotes = computed(() => {
  if (!searchQuery.value.trim()) {
    return notes.value
  }

  const query = searchQuery.value.toLowerCase()
  return notes.value.filter(note =>
    note.title.toLowerCase().includes(query) ||
    note.content.toLowerCase().includes(query)
  )
})

// 处理右键菜单
const handleContextMenu = (event, note) => {
  event.preventDefault()
  contextMenu.value = {
    show: true,
    x: event.clientX,
    y: event.clientY,
    note: note
  }
}

// 关闭右键菜单
const closeContextMenu = () => {
  contextMenu.value.show = false
}

// 处理重命名
const handleRename = () => {
  if (contextMenu.value.note) {
    showRenameDialog.value = true
    newTitle.value = contextMenu.value.note.title
    closeContextMenu()
  }
}

// 确认重命名
const confirmRename = () => {
  if (newTitle.value.trim() && contextMenu.value.note) {
    notesStore.updateNote(contextMenu.value.note.id, { title: newTitle.value.trim() })
    showRenameDialog.value = false
  }
}

// 处理删除
const handleDelete = () => {
  if (contextMenu.value.note) {
    noteToDelete.value = contextMenu.value.note
    showRenameDialog.value = false
    closeContextMenu()
    // 确认删除
    if (confirm(`确定要删除"${contextMenu.value.note.title}"吗？`)) {
      notesStore.deleteNote(contextMenu.value.note.id)
      noteToDelete.value = null
    }
  }
}

// 创建笔记
const handleCreateNote = () => {
  const newNote = notesStore.createNote()
  emit('create', newNote)
}

// 选择笔记
const handleSelectNote = (id) => {
  notesStore.setCurrentNote(id)
  emit('select', id)
}

// 获取预览文本
const getPreview = (content) => {
  if (!content) return '空笔记'
  // 移除 Markdown 语法
  const text = content
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/`/g, '')
    .replace(/\[.*?\]\(.*?\)/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .trim()

  return text.substring(0, 100)
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date

  if (diff < 60000) {
    return '刚刚'
  } else if (diff < 3600000) {
    return `${Math.floor(diff / 60000)} 分钟前`
  } else if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)} 小时前`
  } else if (diff < 604800000) {
    return `${Math.floor(diff / 86400000)} 天前`
  } else {
    return date.toLocaleDateString('zh-CN')
  }
}

// 点击外部关闭右键菜单
const handleClickOutside = () => {
  if (contextMenu.value.show) {
    closeContextMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
