<script setup lang="ts">
import type {Student} from '@/types'
import {readProjectTitleFile} from '@/service/ExcelUntil'
import { useStudentStore } from "@/stores/StudentStore"
import {postStudentsProjectTitle, getALlStudents} from '@/service/adminService'
import {ref} from 'vue'
import { storeToRefs } from 'pinia'

getALlStudents()

const studentStore = useStudentStore()
const students = storeToRefs(studentStore).students
const studentsProjectTitle = ref<Student[]>([])
const file = ref<any>()

const readFile = (f:any) => {
    file.value = f.raw
    readProjectTitleFile(file.value).then((stus:Student[]) => {
        studentsProjectTitle.value = stus
    })
}
const submitFile = () => {
    if(file.value == null) {
        alert('未选择文件')
        return
    }
    students.value.forEach(s => {
        studentsProjectTitle.value.forEach(sp => {
            if(sp.number == s.number) {
                s.projectTitle = sp.projectTitle
            }
        })
    })
    postStudentsProjectTitle(students.value)
}
</script>
<template>
    <div>
        <el-text type="primary" size="large">导入学生毕设题目Excel文件</el-text>
    </div>
    <el-upload ref="myUpload" style="margin-top: 15px;"
        class="upload-demo" :auto-upload="false" :on-change="readFile"
        drag multiple>
        <el-icon style="color:lightskyblue" class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            已读取学生毕设题目Excel文件数据{{ students.length }}项
          </div>
        </template>
    </el-upload>
    <div >
          <el-button style="margin-top: 15px;" @click="submitFile" type="primary">
        <el-icon><Upload /></el-icon>确认上传</el-button> <br>
    </div>
</template>