import type { Student } from '@/types'
import { defineStore } from 'pinia'
import {ref} from 'vue'

export const useStudentStore = defineStore('useStudentStore', () => {
  const students = ref<Student[]>([])
  const groupStudent = (group:any) => {
    const groupS = ref<Student[]>([])
    students.value.forEach((s) => {
        if(s.groupId == group) groupS.value.push(s)
    })
    return groupS
  }
  const getStudent = (id:any) => {
    const student = ref<Student>()
    students.value.forEach(s => {
        if(s.id == id) student.value = s
    })
    return student
  }
  return {groupStudent,students,getStudent}
})