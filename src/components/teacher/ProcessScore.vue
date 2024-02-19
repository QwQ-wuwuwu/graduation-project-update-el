<script setup lang="ts">
import {ref, toRef, watch} from 'vue'
import { useProcessStore } from '@/stores/ProcessStore'
import { useTeacherStore } from '@/stores/TeacherStore'
import { storeToRefs } from 'pinia';
import type { Student, Comment, Detail, Teacher } from '@/types';
import {getStudents, getTeachers, getProcessScoresByPid,
        getFilesByPid, getFile, scoreOrGetInfo,postProcessScore,} from '@/service/teacherService'
import { defineProps } from 'vue';

await getTeachers()

const levelCount = ref<any>({
  score_90: 0,
  score_80: 0,
  score_70: 0,
  score_60: 0,
  score_last: 0,
})

interface StudentList {
  student?: Student,
  score?: number,
  file?: []
}
const studentList = ref<StudentList[]>([])

const processStore = useProcessStore()
const teacherStore = useTeacherStore()

const auth = ref('')
const props = defineProps(['id']);
const pid = toRef(props.id)
const process = ref<any>({})
process.value = processStore.getProcess(pid.value)
const teachers = storeToRefs(teacherStore).teachers
const teacher = ref<any>({})
const students = ref<Student[]>([])               
auth.value = process.value.auth    
students.value = (await getStudents(auth.value)).students
const fileDialog = ref(false)
const selectVisible = ref(false)

teacher.value = teacherStore.getTeacher(sessionStorage.getItem("number"))
const processScores = ref<any[]>([])

processScores.value = await getProcessScoresByPid(pid.value)
const currentPs = ref<any[]>([])
currentPs.value = processScores.value.filter(ps => ps.teacherId == teacher.value.id)

const files = toRef(await getFilesByPid(pid.value))
const selectFiles = ref<any[]>([])

fn()

const items = ref<any[]>([])
items.value = JSON.parse(process.value.items)
const studentId = ref('')
const student = ref<any>()
const processScoresT = ref<any[]>([])
const flag = ref(0)
const detailsT = ref<any[]>([])
const averageScore = ref<number>()
const scores = ref<number[]>([])
const getScore = ref(-1)
const comment = ref<Comment>({
  "teacherName": '',
  "score": 0,
  "detail": []
})
const unTeachers = ref<Teacher[]>([])

const addScore = async (s:any) => {
  unTeachers.value = []
  scores.value = []
  detailsT.value = []
  averageScore.value = 0
  selectVisible.value = true
  studentId.value = s.id
  student.value = s
  const result = await scoreOrGetInfo(pid.value,s.id,teacher.value.id)
  processScoresT.value = result.processScores
  flag.value = result.flag
  processScoresT.value.forEach((ps,index) => {
    detailsT.value[index] = JSON.parse(ps.detail)
  })
  teachers.value.forEach(t => {
    const names:any = detailsT.value.map(d => d.teacherName)
    if(!names.includes(t.name)) unTeachers.value.push(t)
  })
  if(flag.value == 1) {
    const tDetail:any = detailsT.value.filter(d => d.teacherName == teacher.value.name)
    tDetail[0].detail.forEach((d:any) => {
      scores.value[d.number] = d.point
    })
  }
  computedAverageScore()
}

const confirmScore = async () => {
  let sum = ref(0)
  for (let i = 0; i < scores.value.length; i++) {
    if (scores.value[i] != null) {
      const detail = ref<Detail>({
        "number": (i),
        "point": scores.value[i]
      })
      //@ts-ignore
      comment.value.detail.push(detail.value)
      sum.value += scores.value[i] * (items?.value[i].point / 100)
    }
  }
  comment.value.score = Math.round(sum.value)
  comment.value.teacherName = teacher.value.name
  const newDetail = JSON.stringify(comment.value)
  const processScore = ref({
    studentId: studentId.value,
    processId: pid.value,
    teacherId: teacher.value.id,
    detail: newDetail
  })
  processScores.value = await postProcessScore(processScore.value)
  studentList.value = []
  fn()
  selectVisible.value = false
  currentPs.value = processScores.value.filter(ps => ps.teacherId == teacher.value.id)
}

const getFilesInfo = (files:any) => {
  fileDialog.value = true
  selectFiles.value = files
  selectFiles.value.forEach((f: any, index: any) => {
    selectFiles.value[index].detail = f.detail.split('/')[1]
  })
}

const downloadFile = (sNumber:any,pNumber:any) => {
  getFile(pid.value,sNumber,pNumber)
}

function fn () {
  students.value.forEach((s: any) => {
    const student: StudentList = { student: s, file: [], score: -1 }
    let score = 0
    const flagPs = processScores.value.filter(ps => ps.studentId == s.id && ps.teacherId == teacher.value.id)
    const newFiles = files.value.filter((f: any) => f.studentNumber == s.number)
    if(flagPs.length > 0) {
      const tempPs = processScores.value.filter(ps => ps.studentId == s.id)
      if (tempPs.length > 0) {
        tempPs.forEach(ps => {
          const detail = JSON.parse(ps.detail)
          score += parseFloat(detail.score)
        })
        student.score = Math.round(score / tempPs.length)
        student.file = newFiles
        studentList.value.push(student)
      } else {
        student.file = newFiles
        studentList.value.push(student)
      }
    } else {
      student.file = newFiles
      studentList.value.push(student)
    }
  })
  computedLevelCount()
}

watch(scores, () => {
  let sum = ref(0)
  for (let i = 0; i < scores.value.length; i++) {
    if (scores.value[i] != null) {
      sum.value += (scores.value[i] * (items?.value[i].point / 100))
    }
  }
  getScore.value = Math.round(sum.value)
}, {deep:true})

function computedAverageScore() {
  let sum = 0
  detailsT.value.forEach(d => {
    sum += d.score
  })
  //@ts-ignore
  averageScore.value = Math.round(sum / detailsT.value.length)
}

function computedLevelCount() {
  levelCount.value.score_90 = 0
  levelCount.value.score_80 = 0
  levelCount.value.score_70 = 0
  levelCount.value.score_60 = 0
  levelCount.value.score_last = 0
  studentList.value.forEach((s:any) => {
    if(s.score != -1) {
      if (s.score >= 90) {
        levelCount.value.score_90++
      } else if (s.score >= 80) {
        levelCount.value.score_80++
      } else if (s.score >= 70) {
        levelCount.value.score_70++
      } else if (s.score >= 60) {
        levelCount.value.score_60++
      } else {
        levelCount.value.score_last++
      }
    }
  })
}
</script>
<template>
  <div v-show="process.auth == 'audit'">
    <el-text type="info" size="large">第{{ teachers[0].groupId }}组评审：</el-text>
    <el-tag v-for="t in teachers" :key="t.id" class="mx-1" size="large">{{ t.name }} </el-tag>
    <el-text type="danger" size="large">该阶段评分占比{{ process.point }}%</el-text>
  </div>
  <div v-show="process.auth == 'tutor'">
    <el-text type="info" size="large">评审老师：<el-tag size="large">{{ teacher.name }}</el-tag></el-text>
    <el-text type="danger" size="large">该阶段评分占比{{ process.point }}%</el-text>
  </div>
  <div style="margin-top: 15px;">
    <el-text type="info" size="large">共需评分：<el-tag>{{ students.length }}</el-tag></el-text>
    <el-text type="info" size="large">您已评：<el-tag>{{ currentPs.length }}</el-tag></el-text>
  </div>
  <div style="margin-top: 15px;">
    优：<el-tag type="success">{{ levelCount.score_90 }}</el-tag>
    良：<el-tag>{{ levelCount.score_80 }}</el-tag>
    中：<el-tag type="info">{{ levelCount.score_70 }}</el-tag>
    差：<el-tag type="warning">{{ levelCount.score_60 }}</el-tag>
    不合格：<el-tag type="danger">{{ levelCount.score_last }}</el-tag>
  </div>
  <div>
    <el-table :data="studentList" style="width: 100%; margin-top: 15px;" v-show="students.length > 0">
      <el-table-column type="index" label="#"/>
      <el-table-column prop="student.name" label="姓名"/>
      <el-table-column prop="student.teacherName" label="指导教师"/>
      <el-table-column prop="student.projectTitle" label="毕设题目"/>
      <el-table-column>
        <template #default="scope">
          <el-button size="large" type="success" v-show="scope.row.score == -1" @click="addScore(scope.row.student)">
            <el-icon><StarFilled /></el-icon>评分</el-button>
          <el-button v-show="scope.row.score != -1" type="success" size="large" circle @click="addScore(scope.row.student)">
            {{ scope.row.score }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="附件">
        <template #default="scope">
          <el-button type="primary" :disabled="scope.row.file.length == 0" @click="getFilesInfo(scope.row.file)">
            <el-icon><Link /></el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-dialog v-model="selectVisible" :title="student?.name">
    <div>
      <el-text size="large">{{ process.processName }}阶段，您的评分：</el-text>
      <el-text size="large" type="danger">{{ getScore }}</el-text>
      <el-table :data="items" style="width: 100%; margin-top: 15px;" >
        <el-table-column prop="name" label="评分项" />
        <el-table-column prop="description" label="说明"/>
        <el-table-column prop="point" label="比例%"/>
        <el-table-column prop="point" label="得分">
          <template #default="scope">
            <el-input-number placeholder="默认值为0" :min="0" :max="100" v-model="scores[scope.row.number]"/>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin-top: 15px;" v-show="flag == 1">
      <div style="text-align: left; margin-left: 42%;">
        已评：<el-tag v-for="(d,index) in detailsT" :key="index">{{ d.teacherName }}</el-tag> <br>
        <span v-show="process.auth == 'audit'">未评：<el-tag v-for="t in unTeachers" :key="t.id">{{ t.name }}</el-tag> <br></span>
        平均分：<el-tag>{{ averageScore }}</el-tag>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="selectVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmScore">
          <span v-show="flag != 1">确认分数</span>
          <span v-show="flag == 1">修改评分</span>
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="fileDialog" title="附件详情" width="800">
    <el-table :data="selectFiles">
      <el-table-column type="index" label="#" width="150px"/>
      <el-table-column prop="detail" label="附件名"/>
      <el-table-column>
        <template #default="scope">
          <el-button type="primary" @click="downloadFile(scope.row.studentNumber,scope.row.number)">
            <el-icon><Download /></el-icon>下载文件
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>