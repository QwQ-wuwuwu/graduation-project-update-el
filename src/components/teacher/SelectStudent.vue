<script setup lang="ts">
import {getSelect} from '@/service/teacherService'
import type { Student } from '@/types';
import {ref} from 'vue'

const students = ref<Student[]>([])
const result = await getSelect()
students.value = result.students
</script>
<template>
    <div style="margin-bottom: 15px;">
        <el-text type="info" size="large">指导学生信息表</el-text>
    </div>
    <el-table :data="students" border style="width: 100%">
        <el-table-column type="index" label="#" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="projectTitle" label="毕设题目"/>
        <el-table-column prop="groupId" label="所在审核小组" />
        <el-table-column prop="queueNumber" label="答辩顺序" />
    </el-table>
</template>