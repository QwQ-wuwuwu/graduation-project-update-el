<script setup lang="ts">
import {ref, computed} from 'vue'
import {readTeachersFile} from '@/service/ExcelUntil'
import {addTeachers} from '@/service/adminService'
import type {Teacher} from '@/types'

const teachers = ref<Teacher[]>([])
                                    
const readExcel = (event:Event) => {
    const element = event.target as HTMLInputElement
    if (!element || !element.files) {
        return
    }
    readTeachersFile(element.files[0]).then((ts: Teacher[]) => {
        teachers.value = ts
    })
}
const sum = computed(() => {
    return teachers.value.length
})
const importData = () => {
    addTeachers(teachers.value)
    teachers.value = []
}
</script>
<template>
    <el-row style="margin-left: 100px;">
        <el-col :span="18">
            <el-card shadow="always">
                <el-text type="primary" size="large">读取教师Excel表格数据</el-text> <br>
                <input style="margin-bottom: 15px; margin-top: 15px;" type="file" @change="readExcel"> <br>
                <el-text type="primary" size="large">已读取教师表格{{ sum }}项数据</el-text> <br>
                <el-button style="margin-top: 15px;" @click="importData" type="primary"><el-icon><Upload /></el-icon>导入数据</el-button>
            </el-card>
        </el-col>
    </el-row>
</template>