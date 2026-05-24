<template>
  <div class="ai-assistant">
    <!-- API Key 配置 -->
    <div v-if="!apiKey" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
        <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">配置 Claude API</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-4 text-sm">
          请输入您的 Claude API Key 以使用 AI 功能。您的 API Key 将只保存在浏览器本地存储中。
        </p>
        <input
          v-model="inputApiKey"
          type="password"
          placeholder="sk-ant-..."
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 mb-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <div class="flex gap-3">
          <button
            @click="handleSaveApiKey"
            class="flex-1 py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
          >
            保存
          </button>
          <button
            @click="close"
            class="flex-1 py-2 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors"
          >
            取消
          </button>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-4">
          获取 API Key: <a href="https://console.anthropic.com/" target="_blank" class="text-primary-600 hover:underline">Anthropic Console</a>
        </p>
      </div>
    </div>

    <!-- AI 功能面板 -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">AI 助手</h3>

      <!-- 功能按钮 -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <button
          @click="handleSummarize"
          :disabled="isLoading || !hasContent"
          class="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          总结笔记
        </button>

        <button
          @click="handleExpand"
          :disabled="isLoading || !hasContent"
          class="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
          </svg>
          扩展内容
        </button>

        <button
          @click="handleRewrite('professional')"
          :disabled="isLoading || !hasContent"
          class="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          改写（专业）
        </button>

        <button
          @click="handleRewrite('concise')"
          :disabled="isLoading || !hasContent"
          class="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
          </svg>
          改写（简洁）
        </button>
      </div>

      <!-- 加载状态 -->
      <div v-if="isLoading" class="flex items-center justify-center gap-3 py-6">
        <svg class="animate-spin w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-gray-600 dark:text-gray-400">AI 正在处理中...</span>
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
        {{ error }}
      </div>

      <!-- 结果展示 -->
      <div v-if="result" class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto scrollbar-thin">
        <div class="flex justify-between items-center mb-3">
          <h4 class="font-medium text-gray-900 dark:text-gray-100">生成结果</h4>
          <div class="flex gap-2">
            <button
              @click="copyResult"
              class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
            >
              复制
            </button>
            <button
              v-if="canReplace"
              @click="replaceContent"
              class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
            >
              替换
            </button>
            <button
              @click="result = ''"
              class="text-sm text-gray-500 hover:text-gray-600"
            >
              关闭
            </button>
          </div>
        </div>
        <div class="prose prose-sm max-w-none text-gray-700 dark:text-gray-300" v-html="markedResult"></div>
      </div>

      <!-- API Key 管理 -->
      <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          @click="clearApiKey"
          class="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          清除 API Key
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAI } from '../composables/useAI.js'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

const props = defineProps({
  note: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['replace'])

const { apiKey, isLoading, error, saveApiKey, clearApiKey, summarizeNote, expandNote, rewriteNote } = useAI()

const inputApiKey = ref('')
const result = ref('')
const resultType = ref('') // 'summary', 'expand', 'rewrite'

const hasContent = computed(() => props.note?.content && props.note.content.trim().length > 0)
const canReplace = computed(() => resultType.value !== 'summary')

const markedResult = computed(() => {
  if (!result.value) return ''
  const html = marked.parse(result.value)
  return DOMPurify.sanitize(html)
})

const handleSaveApiKey = () => {
  if (inputApiKey.value.trim()) {
    saveApiKey(inputApiKey.value.trim())
  }
}

const close = () => {
  inputApiKey.value = ''
}

const handleSummarize = async () => {
  try {
    resultType.value = 'summary'
    result.value = await summarizeNote(props.note.content)
  } catch (err) {
    console.error('总结失败:', err)
  }
}

const handleExpand = async () => {
  try {
    resultType.value = 'expand'
    result.value = await expandNote(props.note.content)
  } catch (err) {
    console.error('扩展失败:', err)
  }
}

const handleRewrite = async (style) => {
  try {
    resultType.value = 'rewrite'
    result.value = await rewriteNote(props.note.content, style)
  } catch (err) {
    console.error('改写失败:', err)
  }
}

const copyResult = () => {
  navigator.clipboard.writeText(result.value)
}

const replaceContent = () => {
  emit('replace', result.value)
  result.value = ''
}
</script>
