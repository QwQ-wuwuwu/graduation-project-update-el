<script setup lang="ts">
import {getAllGroups,groups, getALlStudents, updateGroup, postStudentsGroup, getAllTeachers} from '@/service/adminService'
import { useStudentStore } from "@/stores/StudentStore"
import { useTeacherStore } from "@/stores/TeacherStore"
import type { Student, Teacher } from '@/types';

import {ref} from 'vue'

getAllGroups()
getALlStudents()
getAllTeachers()

interface newStudent {
    student:Student,
    tgroup:number
}

const dialogVisible = ref(false)
const group = ref()
const newGroup = ref()
const studentId = ref('')
const student = ref<Student>()
const teacherStore = useTeacherStore()
const teachers = ref<Teacher[]>([])
const studentStore = useStudentStore()
const groupStudent = ref<Student[]>([])
const groupTeachers = ref<Teacher[]>([])
const newGroupStudents = ref<newStudent[]>([])
const newGroups = ref<any[]>([])

const getStudents = (gid:number) => {
    newGroupStudents.value = []
    group.value = gid
    groupStudent.value = studentStore.groupStudent(gid).value
    groupTeachers.value = teacherStore.getGroupTeacher(gid)
    teachers.value = teacherStore.teachers
    teachers.value.forEach(t => {
        groupStudent.value.forEach(s => {
            const student: newStudent = { student: s, tgroup: 0 }
            if (s.teacherId == t.id) {
                student.tgroup = t.groupId
                newGroupStudents.value.push(student)
            }
        })
    })
}
const updateGroupF = (sid:string) => {
    newGroups.value = []
    newGroup.value = null
    studentId.value = sid
    student.value = studentStore.getStudent(sid).value
    newGroupStudents.value.filter(s => s.student.id == sid)
    .map(ns => {
        groups.value.forEach((g:any) => {
            if(g != ns.tgroup && g != ns.student.groupId) {
                newGroups.value.push(g)
            }
        })
    })
    dialogVisible.value = true
}
const confirmGroup = async () => {
    await updateGroup(studentId.value,newGroup.value)
    dialogVisible.value = false
}
const creatQueueNumber = () => {
    groupStudent.value.forEach((s,index) => {
        s.queueNumber = index + 1
    })
    postStudentsGroup(groupStudent.value)
}
</script>
<template>
    <el-row>
        <el-col :span="24 / groups.length" v-for="g in groups" :key="g"><div class="grid-content ep-bg-purple">
            <el-button @click="getStudents(g)" type="success">选择第{{ g }}组成员</el-button>
        </div></el-col>
    </el-row>
    <div style="margin-top: 15px;">
        <el-text type="danger" size="large">第{{ group }}组学生人数：
            <el-tag type="danger">{{ groupStudent.length }}</el-tag></el-text> <br> <br>
        <el-text type="info" size="large">审核导师：
            <el-tag v-for="t in groupTeachers" :key="t.id" type="danger">{{ t.name }}</el-tag>
        </el-text>
    </div>
    <el-row >
        <el-table style="width: 100%; margin-top: 15px;" :data="newGroupStudents">
                <el-table-column type="index" label="序号" width="180"/>
                <el-table-column prop="student.name" label="姓名"/>
                <el-table-column prop="student.groupId" label="审核小组"/>
                <el-table-column prop="tgroup" label="不可分配到"/>
                <el-table-column prop="student.queueNumber" label="答辩顺序"/>
                <el-table-column>
                    <template #default="scope">
                        <el-button size="small" type="primary" @click="updateGroupF(scope.row.student.id)" >
                            <el-icon><Edit /></el-icon>修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
    </el-row>
    <div style="margin-top: 15px;">
        <el-button v-show="groupStudent.length > 0" type="primary" @click="creatQueueNumber">一键生成答辩顺序</el-button>
    </div>
    <el-dialog v-model="dialogVisible" title="修改分组" width="30%">
        <div>
            <el-tag size="large">{{ student?.name }}</el-tag>同学目前分组：
            <el-tag>{{ group }}</el-tag> <br> <br>
            将其分配到：
            <el-select v-model="newGroup" size="small" placeholder="Select" style="width: 80px">
                <el-option v-for="g in newGroups" :key="g" :label="g" :value="g"/>
            </el-select>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="confirmGroup">
              Confirm
            </el-button>
          </span>
        </template>
    </el-dialog>
</template>