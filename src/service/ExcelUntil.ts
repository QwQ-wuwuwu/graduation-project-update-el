import * as XLSX from 'xlsx'
import type {Teacher, Student} from '@/types'

export function readTeachersFile(file:Blob) {
    return new Promise<Teacher[]>((resolve) => {
        const reader = new FileReader()
        const teachers:Teacher[] = []
        reader.readAsBinaryString(file)
        reader.onload = (e:ProgressEvent<FileReader>) => {
            const data = e.target?.result

            //创建工作簿(包含一个或多个工作表的容器)，将数据转为二进制流
            const wb = XLSX.read(data, { type: 'binary' })

            const sheet = wb.Sheets[wb.SheetNames[0]] // 创建工作表，默认为第一张表
            XLSX.utils.sheet_to_json(sheet).forEach((t:any) => {
                teachers.push({
                    name: t['姓名'],
                    number: t['账号'].toString(),
                    total: t['可选人数'],
                    groupId: t['组号'],
                    groupA: t['A组'],
                    groupC: t['C组']
                })
            })
            resolve(teachers)
        }
    })
}
export function readStudentsFile(file:Blob) {
    return new Promise<Student[]>((resolve) => {
        const reader = new FileReader()
        const students:Student[] = []
        reader.onload = (e:ProgressEvent<FileReader>) => {
            const data = e.target?.result

            //创建工作簿(包含一个或多个工作表的容器)，将数据转为二进制流
            const wb = XLSX.read(data, { type: 'binary' })

            const sheet = wb.Sheets[wb.SheetNames[0]] // 创建工作表，默认为第一张表
            XLSX.utils.sheet_to_json(sheet).forEach((t:any) => {
                students.push({
                    name: t['姓名'],
                    number: t['账号'].toString()
                })
            })
            resolve(students)
        }
        reader.readAsBinaryString(file)
    })
}
export function readProjectTitleFile(file:Blob) {
    return new Promise<Student[]>((resolve) => {
        const reader = new FileReader()
        const students:Student[] = []
        reader.readAsBinaryString(file)
        reader.onload = (e:ProgressEvent<FileReader>) => {
            const data = e.target?.result
            const wb = XLSX.read(data, { type: 'binary'})
            const sheet = wb.Sheets[wb.SheetNames[0]]
            XLSX.utils.sheet_to_json(sheet).forEach((s:any) => {
                students.push({
                    name: s['姓名'],
                    number: s['账号'],
                    projectTitle: s['毕设题目']
                })
            })
            resolve(students)
        }
    })
}