import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Student } from '@/types'

export const useStudentStore = defineStore('useStudentStore', () => {
  const students = ref<Student[]>([])
  return {students}
})
