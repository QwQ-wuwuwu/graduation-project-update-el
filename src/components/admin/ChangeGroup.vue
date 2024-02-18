<script setup lang="ts">
import {getAllGroups,groups, getALlStudents, updateGroup, postStudentsGroup, 
    getAllTeachers, putStudentsAndTeachers} from '@/service/adminService'
import { useStudentStore } from "@/stores/StudentStore"
import { useTeacherStore } from "@/stores/TeacherStore"
import type { Student, Teacher } from '@/types';
import { storeToRefs } from 'pinia';

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
const teachers = storeToRefs(teacherStore).teachers
const studentStore = useStudentStore()
const students = storeToRefs(studentStore).students
const groupStudent = ref<Student[]>([])
const groupTeachers = ref<Teacher[]>([])
const newGroupStudents = ref<newStudent[]>([])
const newGroups = ref<any[]>([])

const newStudentsList = ref<Student[]>([])
const centerDialogVisible = ref(false)
const createTutor = () => {
    teachers.value.forEach(t => {
        let unIncludeGroups = groups.value.filter((g:any) => g != t.groupId) // 非导师的审核小组号
        let groupA = 0 // 由于每次都会更改数据，所以优秀学生数量和不好学生数量每次都得重新计算
        let groupC = 0
        teachers.value.forEach(t => {
            groupA += t.groupA
            groupC += t.groupC
        })
        while(t.groupA > 0) { // A组
            let A = Math.floor(Math.random() * groupA) // 随机一个优秀学生下标
            let groupIndex = Math.floor(Math.random() * unIncludeGroups.length)
            let student:Student = students.value[A]
            student.teacherId = t.id
            student.teacherName = t.name
            student.groupId = unIncludeGroups[groupIndex] // 非指导老师所在小组的审核小组
            newStudentsList.value.push(student)
            t.total -= 1
            students.value.splice(A,1)
            t.groupA -= 1
        }
        while(t.groupC > 0) { // C组
            let C = Math.floor(Math.random() * groupC) // 随机一个不好学生下标
            let groupIndex = Math.floor(Math.random() * unIncludeGroups.length)
            let student:Student = students.value[students.value.length - C - 1]
            student.teacherId = t.id
            student.teacherName = t.name
            student.groupId = unIncludeGroups[groupIndex] // 非指导老师所在小组的审核小组
            newStudentsList.value.push(student)
            t.total -= 1
            students.value.splice(students.value.length - C - 1,1)
            t.groupC -= 1
        }
    })
    // 剩余学生随机分配
    teachers.value.forEach(t => {
        let unIncludeGroups = groups.value.filter((g:any) => g != t.groupId) // 非导师的审核小组号
        while(t.total > 0) {
            let randomIndex = Math.floor(Math.random() * students.value.length)
            let student:Student = students.value[randomIndex]
            let groupIndex = Math.floor(Math.random() * unIncludeGroups.length)
            student.teacherId = t.id
            student.teacherName = t.name
            student.groupId = unIncludeGroups[groupIndex] // 非指导老师所在小组的审核小组
            newStudentsList.value.push(student)
            t.total -= 1
            students.value.splice(randomIndex,1)
        }
    })
    centerDialogVisible.value = true
}

const confirmData = () => {
    putStudentsAndTeachers(newStudentsList.value)
}

const getStudents = (gid:number) => {
    newGroupStudents.value = []
    group.value = gid
    groupStudent.value = studentStore.groupStudent(gid).value
    groupTeachers.value = teacherStore.getGroupTeacher(gid)
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
        <el-col>
            <el-button type="primary" @click="createTutor">分配导师及审核小组</el-button>
        </el-col>
    </el-row>
    <el-row style="margin-top: 15px;">
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
            <el-table-column type="index" label="#"/>
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
    <el-dialog v-model="centerDialogVisible" title="Warning" width="800" center>
        <el-table style="width: 100%; margin-top: 15px;" :data="newStudentsList">
            <el-table-column type="index" label="#"/>
            <el-table-column prop="name" label="姓名"/>
            <el-table-column prop="groupId" label="审核小组"/>
            <el-table-column prop="teacherName" label="指导教师"/>
        </el-table>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="centerDialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="confirmData">
              导入数据库
            </el-button>
          </div>
        </template>
      </el-dialog>
</template>