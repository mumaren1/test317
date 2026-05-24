import { ref } from 'vue'

export function useAI() {
  const apiKey = ref('')
  const isLoading = ref(false)
  const error = ref(null)

  // 从 localStorage 加载 API Key
  const loadApiKey = () => {
    const saved = localStorage.getItem('goodnote_claude_api_key')
    if (saved) {
      apiKey.value = saved
    }
  }

  // 保存 API Key
  const saveApiKey = (key) => {
    apiKey.value = key
    localStorage.setItem('goodnote_claude_api_key', key)
  }

  // 清除 API Key
  const clearApiKey = () => {
    apiKey.value = ''
    localStorage.removeItem('goodnote_claude_api_key')
  }

  // 总结笔记内容
  const summarizeNote = async (content) => {
    if (!apiKey.value) {
      throw new Error('请先配置 Claude API Key')
    }

    if (!content || content.trim().length === 0) {
      throw new Error('笔记内容为空')
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey.value,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
          'dangerously-allow-browser': 'true'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `请总结以下笔记内容，提取关键信息。要求：
1. 提取核心观点（不超过3个）
2. 列出关键细节（最多5点）
3. 保持客观中立
4. 输出为 Markdown 格式

笔记内容：
${content}`
          }]
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || '请求失败')
      }

      const data = await response.json()
      return data.content[0].text
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 改写笔记
  const rewriteNote = async (content, style = 'professional') => {
    if (!apiKey.value) {
      throw new Error('请先配置 Claude API Key')
    }

    isLoading.value = true
    error.value = null

    const stylePrompts = {
      professional: '专业、正式的商务风格',
      casual: '轻松、口语化的风格',
      concise: '简洁明了的风格',
      detailed: '详细完整的风格'
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey.value,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
          'dangerously-allow-browser': 'true'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 2000,
          messages: [{
            role: 'user',
            content: `请将以下笔记改写为${stylePrompts[style] || style}风格，保持原意不变：

${content}`
          }]
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || '请求失败')
      }

      const data = await response.json()
      return data.content[0].text
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 扩展笔记内容
  const expandNote = async (content) => {
    if (!apiKey.value) {
      throw new Error('请先配置 Claude API Key')
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey.value,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
          'dangerously-allow-browser': 'true'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 2000,
          messages: [{
            role: 'user',
            content: `请基于以下笔记内容进行扩展，添加更多细节和说明，保持原有结构和逻辑：

${content}`
          }]
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || '请求失败')
      }

      const data = await response.json()
      return data.content[0].text
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 问答
  const chat = async (context, question) => {
    if (!apiKey.value) {
      throw new Error('请先配置 Claude API Key')
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey.value,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
          'dangerously-allow-browser': 'true'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `基于以下笔记内容回答问题，如果笔记内容中没有相关信息，请如实说明。

笔记内容：
${context}

问题：${question}`
          }]
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || '请求失败')
      }

      const data = await response.json()
      return data.content[0].text
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 初始化时加载 API Key
  loadApiKey()

  return {
    // 状态
    apiKey,
    isLoading,
    error,

    // 方法
    loadApiKey,
    saveApiKey,
    clearApiKey,
    summarizeNote,
    rewriteNote,
    expandNote,
    chat
  }
}
