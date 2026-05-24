import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useNotesStore = defineStore('notes', () => {
  // 状态
  const notes = ref([])
  const currentNoteId = ref(null)
  const isLoading = ref(false)

  // 计算属性
  const currentNote = computed(() => {
    return notes.value.find(note => note.id === currentNoteId.value) || null
  })

  const sortedNotes = computed(() => {
    return [...notes.value].sort((a, b) =>
      new Date(b.updatedAt) - new Date(a.updatedAt)
    )
  })

  // 从 localStorage 加载笔记
  const loadNotes = () => {
    try {
      const saved = localStorage.getItem('goodnote_notes')
      if (saved) {
        notes.value = JSON.parse(saved)
      }
    } catch (error) {
      console.error('加载笔记失败:', error)
    }
  }

  // 保存笔记到 localStorage
  const saveNotes = () => {
    try {
      localStorage.setItem('goodnote_notes', JSON.stringify(notes.value))
    } catch (error) {
      console.error('保存笔记失败:', error)
    }
  }

  // 创建新笔记
  const createNote = () => {
    const newNote = {
      id: generateId(),
      title: '未命名笔记',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    notes.value.unshift(newNote)
    currentNoteId.value = newNote.id
    saveNotes()

    return newNote
  }

  // 更新笔记
  const updateNote = (id, updates) => {
    const index = notes.value.findIndex(note => note.id === id)
    if (index !== -1) {
      notes.value[index] = {
        ...notes.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      saveNotes()
    }
  }

  // 删除笔记
  const deleteNote = (id) => {
    const index = notes.value.findIndex(note => note.id === id)
    if (index !== -1) {
      notes.value.splice(index, 1)

      // 如果删除的是当前笔记，切换到其他笔记
      if (currentNoteId.value === id) {
        currentNoteId.value = notes.value.length > 0 ? notes.value[0].id : null
      }

      saveNotes()
    }
  }

  // 设置当前笔记
  const setCurrentNote = (id) => {
    currentNoteId.value = id
  }

  // 搜索笔记
  const searchNotes = (query) => {
    if (!query.trim()) {
      return sortedNotes.value
    }

    const lowerQuery = query.toLowerCase()
    return notes.value.filter(note =>
      note.title.toLowerCase().includes(lowerQuery) ||
      note.content.toLowerCase().includes(lowerQuery)
    )
  }

  // 生成唯一 ID
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // 初始化时加载笔记
  loadNotes()

  return {
    // 状态
    notes,
    currentNoteId,
    currentNote,
    sortedNotes,
    isLoading,

    // 方法
    createNote,
    updateNote,
    deleteNote,
    setCurrentNote,
    searchNotes,
    loadNotes,
    saveNotes
  }
})
