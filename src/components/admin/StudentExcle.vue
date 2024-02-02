<script setup lang="ts">
import type { Student } from '@/types';
import {ref,computed} from 'vue'
import {readStudentsFile} from '@/service/ExcelUntil'
import {addStudent} from '@/service/adminService'

const students = ref<Student[]>([])

const readExcel = (event:Event) => {
    const element = event.target as HTMLInputElement
    if (!element || !element.files) {
        return
    }
    readStudentsFile(element.files[0]).then((ts: Student[]) => {
        students.value = ts
    })
}
const sum = computed(() => {
    return students.value.length
})
const importData = () => {
    addStudent(students.value)
    students.value = []
}
</script>
<template>
    <el-row style="margin-left: 100px;">
        <el-col :span="18">
            <el-card shadow="always">
                <el-text type="primary" size="large">读取学生Excel表格数据</el-text> <br>
                <input style="margin-bottom: 15px; margin-top: 15px;" type="file" @change="readExcel"> <br>
                <el-text type="primary" size="large">已读取学生表格{{ sum }}项数据</el-text> <br>
                <el-button style="margin-top: 15px;" @click="importData" type="primary"><el-icon><Upload /></el-icon>导入数据</el-button>
            </el-card>
        </el-col>
    </el-row>
</template>