import axios from "@/axios"
import {ref} from 'vue'
import { useProcessStore } from '@/stores/ProcessStore'
import {useFilesStore} from '@/stores/FilesStore'
import type {Student} from '@/types'

export const getAllTeachers = async () => {
    const teachers = ref<any>([])
    const code = ref(404)
    const student = ref<Student>()
    await axios({
        method: 'get',
        url: '/student/teacher'
    }).then((res:any) => {
        code.value = res.data.code
        if(res.data.code == 200) {
            teachers.value = res.data.data.teachers
        }
        else {
            student.value = res.data.data?.student
        }
    })
    return {teachers,code,student}
}
export const tutorSelection = async (tid:string,tname:string) => {
    await axios({
        method: 'put',
        url: `/student/tutors/${tid}/${tname}`
    }).then((res:any) => {
        if(res.data.code == 402) {
            alert('该导师已被选满，请刷新页面')
            return
        }
        if(res.data.code == 203) {
            alert('您已选择导师，不可改选')
            return
        }
    })
}
export const getAllProcess = async () => {
    const processStore = useProcessStore()
    if (processStore.processesS.length > 0) return processStore.processesS
    await axios.get('/student/process')
    .then((res) => {
        processStore.processesS = res.data.data.processes ?? []
    })
}
export const getFilesByStu = async () => {
    const filesStore = useFilesStore()
    await axios.get('/student/files')
    .then((res) => {
        filesStore.files = res.data.data.files
    })
}