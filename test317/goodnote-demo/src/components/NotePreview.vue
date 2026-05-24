<template>
  <div class="note-preview h-full flex flex-col bg-gray-50 dark:bg-gray-900">
    <!-- 预览头部 -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">预览</h2>
    </div>

    <!-- 预览内容 -->
    <div class="flex-1 overflow-y-auto p-6 scrollbar-thin">
      <div v-if="note && note.content" class="prose max-w-none" v-html="previewContent"></div>
      <div v-else class="text-center text-gray-400 dark:text-gray-600 mt-20">
        <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <p>开始输入 Markdown 内容，这里将显示预览</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

const props = defineProps({
  note: {
    type: Object,
    default: null
  }
})

// 配置 marked
marked.setOptions({
  breaks: true,
  gfm: true
})

// 预览内容
const previewContent = computed(() => {
  if (!props.note?.content) return ''

  try {
    const html = marked.parse(props.note.content)
    return DOMPurify.sanitize(html)
  } catch (error) {
    console.error('Markdown 解析失败:', error)
    return '<p class="text-red-500">Markdown 解析失败</p>'
  }
})
</script>
