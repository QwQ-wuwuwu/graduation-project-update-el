import axios from "@/axios"
import type { Process, ProcessItem, StudentAttach, Teacher, Student } from '@/types'
import { useProcessStore } from '@/stores/ProcessStore'
import { useStudentStore } from "@/stores/StudentStore"
import { useTeacherStore } from "@/stores/TeacherStore"
import { storeToRefs } from "pinia"
import {ref} from 'vue'

const padZero = (num: number) => {
  return num < 10 ? '0' + num : num
}
export const DateFormate = (date: Date) => {
  return (
    date.getFullYear() +
    '-' +
    padZero(date.getMonth() + 1) +
    '-' +
    padZero(date.getDate()) +
    ' ' +
    padZero(date.getHours()) +
    ':' +
    padZero(date.getMinutes())
  )
}
export const updateTime = async (start: string, end: string) => {
  await axios({
    method: 'put',
    url: '/admin/time',
    params: {
      start,
      end
    }
  }).then(() => {
    //@ts-ignore
    ElMessage({message:'设置成功' + '\n' + '开始时间为：' + start + '\n' + '结束时间为：' + end, 
    type:'success', center: true })
  })
}
export const addProcessService = async (ps: Process) => {
  if ((ps.items as ProcessItem[])?.length > 0) {
    // @ts-ignore
    ps.items = JSON.stringify(ps.items)
  }
  if ((ps.studentAttach as StudentAttach[])?.length > 0) {
    // @ts-ignore
    ps.studentAttach = JSON.stringify(ps.studentAttach)
  }
  await axios({
    method: 'post',
    url: '/admin/process',
    data: ps
  }).then((res:any) => {
    const processStore = useProcessStore()
    const processR = storeToRefs(processStore).processesS
    processR.value = res.data.data.processes ?? []
  })
}
// store不为空再发起请求
export const listProcess = async () => {
  const processStore = useProcessStore()
  if (processStore.processesS.length > 0) return processStore.processesS
  axios.get('/admin/process').then(res => {
    processStore.processesS = res.data.data.processes ?? []
  })
}
export const deleteProcess = async (pid:string) => {
  await axios({
      method: 'delete',
      url: `/admin/process/${pid}`
  })
}
export const addTeachers = async (teachers:Teacher[]) => {
  if(teachers.length == 0) {
      alert('未上传文件')
      return
  }
  await axios({
      method: 'post',
      url: '/admin/teacher',
      data: teachers
  }).then(() => {
      //@ts-ignore
      ElMessage({message:'数据导入成功！', type:'success', center: true })
  })
}
export const addStudent = async (students:Student[]) => {
  if (students.length == 0) {
    alert('未上传文件')
    return
  }
  await axios({
    method: 'post',
    url: '/admin/student',
    data: students
  }).then(() => {
    //@ts-ignore
    ElMessage({message:'数据导入成功！', type:'success', center: true })
  })
}
export const updateP1 = async (number:string, pw1:string, pw2:string) => {
  if(pw1 !== pw2) {
      alert('两次输入密码不一致')
      return
  }
  if(number == '') {
      alert('账号不能为空')
      return
  }
  if(pw1 == '' || pw2 == '') {
      alert('新密码不能为空')
      return
  }
  await axios({
      method: 'put',
      url: `/admin/password/${number}/${pw1}`
  }).then(() => {
      //@ts-ignore
      ElMessage({message:'重置密码成功，请妥善保存密码！', type:'success', center: true })
  })
}
export const updateP2 = async (number:string) => {
  if(number == '') {
      alert('账号不能为空')
      return
  }
  await axios({
      method: 'put',
      url: `/admin/password/${number}`
  }).then(() => {
      //@ts-ignore
      ElMessage({message:'重置密码成功，为默认密码！', type:'success', center: true })
  })
}
export const groups = ref<any>([])
export const getAllGroups = async () => {
    await axios.get('/admin/groups')
    .then(res => {
        groups.value = res.data.data.groups
    })
}
export const getALlStudents = async () => {
  const studentStore = useStudentStore()
  if(studentStore.students.length > 0) return studentStore.students
  await axios.get('/admin/students')
  .then(res => {
    studentStore.students = res.data.data.students ?? []
  })
}
export const updateGroup = async (sid:string,newGroup:number) => {
  await axios({
    method: 'put',
    url: `/admin/group/${sid}/${newGroup}`
  }).then((res) => {
    if(res.data.code == 404) {
      alert('更新失败')
      return
    }
    //@ts-ignore
    ElMessage({message:'更新成功！', type:'success', center: true })
  })
}
export const postStudentsGroup = async (students:any[]) => {
  await axios({
    method: 'put',
    url: '/admin/group',
    data: students
  }).then(res => {
    if(res.data.code == 404) {
      alert('更新失败')
      return
    }
    //@ts-ignore
    ElMessage({message:'更新成功！', type:'success', center: true })
  })
}
export const postStudentsProjectTitle = async (students:any[]) => {
  await axios({
    method: 'put',
    url: '/admin/projectTitle',
    data: students
  }).then(res => {
    if(res.data.code == 404) {
      alert('导入失败')
      return
    }
    //@ts-ignore
    ElMessage({message:'导入成功！', type:'success', center: true })
  })
}
export const getAllTeachers = async () => {
  const teacherStore = useTeacherStore()
  if(teacherStore.teachers.length > 0) return teacherStore.teachers
  await axios.get('/admin/teachers')
  .then(res => {
    teacherStore.teachers = res.data.data.teachers ?? []
  })
}
export const putStudentsAndTeachers = async (students:any[]) => {
  await axios({
    method: 'put',
    url: '/admin/selection',
    data: students
  }).then(res => {
    if(res.data.code == 200) {
      //@ts-ignore
      ElMessage({message:'随机分配导师和审核小组成功！', type:'success', center: true })
    }
  })
}
