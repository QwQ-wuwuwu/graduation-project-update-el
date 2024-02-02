<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia';
import { getAllProcess, getAllProcessScores, getTeachers, getStudentsByGroup} from '@/service/teacherService'
import { useProcessStore } from '@/stores/ProcessStore'
import { useProcessScoreStore } from '@/stores/ProcessScoreStore'
import { useTeacherStore } from '@/stores/TeacherStore'
import { useStudentStore } from '@/stores/StudentGroupStore'
import type {Student, Process} from '@/types'

const levelCount = ref<any>({
  score_90: 0,
  score_80: 0,
  score_70: 0,
  score_60: 0,
  score_last: 0,
})

interface StudentScore {
  student?: Student
  totalScore: number
  scores?: { process?: Process; score?: number }[]
}
const studentsScores:StudentScore[] = []

await getAllProcess()
await getAllProcessScores()
await getTeachers()
await getStudentsByGroup()

const studentStore = useStudentStore()
const students = storeToRefs(studentStore).students
const processStore = useProcessStore()
const processScoreStore = useProcessScoreStore()
const teacherStore = useTeacherStore()
const processes:any = storeToRefs(processStore).processesS
const processScores = storeToRefs(processScoreStore).processScores
const teachers = storeToRefs(teacherStore).teachers
const pid = ref('')
const process = ref<any>({})

process.value = processStore.getProcess(pid.value)

students.value.forEach((s) => {
    const newStudentScore: StudentScore = { student: s, scores: [], totalScore: 0 }
    let totalScore: any = 0
    const tempProcessScores = processScores.value.filter(
        ps => teachers.value.map(t => t.id).includes(ps.teacherId) || ps.studentId == s.id
    ) // 过滤出本小组内以及该学生导师评分阶段的评分
    processes.value.forEach((p: any) => {
        const proProcessScores = tempProcessScores.filter(
            (ps) => ps.processId == p.id) // 过滤出当前阶段的所有评分
        let score: any = 0
        const stuProcessScores = proProcessScores.filter(
            (ps: any) => ps.studentId == s.id) // 过滤出当前阶段的当前学生评分
        stuProcessScores.forEach((sps: any) => {
            sps = JSON.parse(sps.detail)
            score += sps.score
        })
        score = (score / stuProcessScores.length)
        if (score) {
            totalScore += parseFloat((p.point * 0.01 * score).toFixed(2))
        }
        newStudentScore.scores?.push({ process: p, score: score.toFixed(2) })
    })
    newStudentScore.totalScore = totalScore
    studentsScores.push(newStudentScore)
    if (totalScore >= 90) {
        levelCount.value.score_90++
    } else if (totalScore >= 80) {
        levelCount.value.score_80++
    } else if (totalScore >= 70) {
        levelCount.value.score_70++
    } else if (totalScore >= 60) {
        levelCount.value.score_60++
    } else {
        levelCount.value.score_last++
    }
})
</script>
<template>
    <div>
        <el-text type="info" size="large">小组成绩一览表</el-text>
        <div style="margin-top: 15px;">
            <el-text type="success" size="large">优秀：</el-text><el-tag type="success">{{ levelCount.score_90 }}</el-tag>
            <el-text type="primary" size="large">良好：</el-text><el-tag>{{ levelCount.score_80 }}</el-tag>
            <el-text type="info" size="large">中等：</el-text><el-tag type="info">{{ levelCount.score_70 }}</el-tag>
            <el-text type="warning" size="large">及格：</el-text><el-tag type="warning">{{ levelCount.score_60 }}</el-tag>
            <el-text type="danger" size="large">不合格：</el-text><el-tag type="danger">{{ levelCount.score_last }}</el-tag>
            <el-text type="info" size="large">共：</el-text><el-tag type="info">{{ studentsScores.length }}</el-tag>
        </div>
        <el-table :data="studentsScores" style="width: 100%; margin-top: 15px;"
         :default-sort="{ prop: 'totalScore', order: 'descending' }">
            <el-table-column type="index" label="#" width="90" />
            <el-table-column prop="student.name" label="姓名" width="90" />
            <el-table-column prop="student.teacherName" label="指导教师" width="180" />
            <el-table-column prop="totalScore" label="总成绩"/>
            <el-table-column v-for="(p,index) in processes" :key="p.id" :label="p.processName + p.point + '%'">
                <template #default="scope">
                    {{scope.row.scores[index].score}}
                </template>	
            </el-table-column>
        </el-table>
    </div>
</template>