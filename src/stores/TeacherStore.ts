import type { Teacher } from '@/types'
import { defineStore } from 'pinia'
import {ref} from 'vue'

export const useTeacherStore = defineStore('useTeacherStore', () => {
    const teachers = ref<Teacher[]>([])
    const getGroupTeacher = (gid:any) => {
        let groupTeachers = []
        groupTeachers = teachers.value.filter(t => t.groupId == gid)
        return groupTeachers
    }
    const getTeacher = (number:any) => {
        const teacher = ref<Teacher>()
        teachers.value.forEach(t => {
            if(t.number == number) {
                teacher.value = t
                return
            }
        })
        return teacher.value
    }
    return {teachers, getTeacher,getGroupTeacher}
})