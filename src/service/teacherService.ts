import { useProcessStore } from '@/stores/ProcessStore'
import { useTeacherStore } from '@/stores/TeacherStore'
import { useStudentStore } from '@/stores/StudentGroupStore'
import axios from "@/axios"
import { useProcessScoreStore } from '@/stores/ProcessScoreStore'

export const getAllProcess = async () => {
    const processStore = useProcessStore()
    if (processStore.processesS.length > 0) return processStore.processesS
    await axios.get('/user/process')
    .then((res) => {
        processStore.processesS = res.data.data.processes ?? []
    })
}
export const getStudents = async (auth:any) => {
    let students:any = []
    await axios.get(`teacher/group/${auth}`)
    .then(res => {
        students = res.data.data.students ?? []
    })
    students.sort((x:any,y:any) => (x.queueNumber ?? 0) - (y.queueNumber ?? 0) )
    return {students}
}
export const getStudentsByGroup = async () => {
    const studentStore = useStudentStore()
    if(studentStore.students.length > 0) return studentStore.students
    await axios.get('/teacher/student/group')
    .then(res => {
        studentStore.students = res.data.data.students ?? []
    })
}
export const getTeachers = async () => {
    const teacherStore = useTeacherStore()
    if(teacherStore.teachers.length > 0) return teacherStore.teachers
    await axios.get('/teacher/teacher')
    .then(res => {
        teacherStore.teachers = res.data.data.teachers ?? []
    })
}
export const scoreOrGetInfo = async (pid:any,sid:any,tid:any) => {
    let processScores:any = []
    let flag:number = 0
    await axios.get(`/teacher/processScore/${pid}/${sid}/${tid}`)
    .then(res => {
        if(res.data.code == 200) {
            processScores = res.data.data?.processScores
            flag = res.data.data?.flag
        }
    })
    return {processScores, flag}
}
export const getProcessScoresByPidAndTid = async (tid:string,pid:any) => {
    let processScores:any = []
    await axios.get(`/teacher/processScore/${pid}/${tid}`)
    .then(res => {
        processScores = res.data.data.processScores ?? []
    })
    return processScores
}
export const getProcessScoresByPid = async (pid:string) => {
    let processScores:any = []
    await axios.get(`/teacher/processScore/${pid}`)
    .then(res => {
        processScores = res.data.data.processScores 
    })
    return {processScores}
}
export const postProcessScore = async (processScore:any) => {
    let processScores:any = []
    await axios({
        method: 'post',
        url: '/teacher/processScore',
        data: processScore
    }).then((res:any) => {
        if(res.data.code == 200) {
            //@ts-ignore
            ElMessage({message:'评分成功！', type:'success', center: true })
            processScores = res.data.data.processScores ?? []
        }
        else alert(res.data.message)
    })
    return processScores
}
export const getFile = async (pid:string,sNumber:string,pNumber:any) => {
    await axios({
        method: 'get',
        url: `/teacher/download/${pid}/${sNumber}/${pNumber}`,
        responseType: 'blob'
    }).then((res:any) => {
        if(res.headers['filename'] == null) {
            alert('该学生未上传此文件')
            return
        }
        const filename = decodeURIComponent(res.headers['filename']) // 解码后端返回的字节流文件名
        const blob = new Blob([res.data]) // 后端返回的二进制流，前端相应的也用二进制容器接收
        const link = document.createElement('a') // 下载文件需要触发，故创建一个a标签模拟点击下载

        // 目的是将 Blob 对象的 URL 赋值给 <a> 标签的 href 属性，
        // 从而创建一个指向该 Blob 对象的链接。这样，点击这个链接时，浏览器就会按照 Blob 对象的内容执行下载
        link.href = window.URL.createObjectURL(blob)

        link.download = filename // 指定文件名保存文件
        document.body.appendChild(link);// 将 a 标签添加到文档并触发点击
        link.click();
        document.body.removeChild(link);// 清理
    }).catch((err:any) => {
        alert('文件下载失败' + err)
    })
}
export const getUnSelect = async () => {
    let students:any = []
    await axios.get('/teacher/unselect')
    .then(res => {
        students = res.data.data.students
    })
    return {students}
}
export const getSelect = async () => {
    let students:any = []
    await axios.get('/teacher/student')
    .then(res => {
        students = res.data.data.students
    })
    return {students}
}
export const getProcessScoresByGroup = async () => {
    let processScores:any = []
    await axios.get('/teacher/processScore')
    .then(res => {
        processScores = res.data.data.processScores ?? []
    })
    return processScores
}
export const getAllProcessScores = async () => {
    const processScoreStore = useProcessScoreStore()
    if(processScoreStore.processScores.length > 0) return processScoreStore.processScores
    await axios.get('/teacher/processScores')
    .then(res => {
        processScoreStore.processScores = res.data.data.processScores ?? []
    })
}
export const getProcessScores = async (pid:string) => {
    let processScores:any = []
    await axios.get(`/teacher/processScores/${pid}`)
    .then(res => {
        processScores = res.data.data.processScores ?? []
    })
    return processScores
}
export const getFilesByPid = async (pid:any) => {
    let files:any = []
    await axios.get(`/teacher/files/${pid}`)
    .then(res => {
        files = res.data.data.files ?? []
    })
    return files
}