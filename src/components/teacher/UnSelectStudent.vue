<script setup lang="ts">
import {getUnSelect} from '@/service/teacherService'
import type { Student } from '@/types';
import {ref} from 'vue'

const students = ref<Student[]>([])
const result = await getUnSelect()
students.value = result.students
</script>
<template>
    <div style="margin-bottom: 15px;">
        <el-text type="info" size="large">未选择导师学生信息表</el-text>
    </div>
<el-table :data="students" border style="width: 100%">
    <el-table-column type="index" label="#"/>
    <el-table-column prop="name" label="姓名"/>
    <el-table-column prop="projectTitle" label="毕设题目"/>
    <el-table-column prop="number" label="学号" />
</el-table>
</template>