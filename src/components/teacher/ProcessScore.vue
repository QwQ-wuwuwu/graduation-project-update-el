<script setup lang="ts">
import {getAllProcess, getStudents, getTeachers, scoreOrGetInfo, 
        postProcessScore, getFile, deleteProcessScore, getProcessScoresByPidAndTid} from '@/service/teacherService'
import { useProcessStore } from '@/stores/ProcessStore'
import { useTeacherStore } from '@/stores/TeacherStore'
import type { Student, Comment, Detail } from '@/types';
import { storeToRefs } from 'pinia';
import {ref} from 'vue'

await getAllProcess()
await getTeachers()

const processStore = useProcessStore()
const teacherStore = useTeacherStore()
const processes = storeToRefs(processStore).processesS
const teachers = storeToRefs(teacherStore).teachers
const students = ref<Student[]>([])
const psDetail = ref<any[]>([])
const selectVisible = ref(false)
const items = ref<any[]>([])
const attach = ref<any[]>([])

let pid = ''
const sid = ref('')
const process = ref<any>({})
const teacher = ref<any>({})
const processScores = ref<any[]>([])
teacher.value = teacherStore.getTeacher(sessionStorage.getItem("number"))

const confirmP = async () => {
  psDetail.value = []
  process.value = processStore.getProcess(pid)
  const auth = process.value.auth
  processScores.value = await getProcessScoresByPidAndTid(teacher.value.id,pid)
  const result:any = await getStudents(auth)                    
  students.value = result.students
  items.value = JSON.parse(process.value.items)
  attach.value = JSON.parse(process.value.studentAttach)
}

const student = ref<any>()
const processScoresT = ref<any[]>([])
const flag = ref<number>(0)
const detailsT = ref<any[]>([])
const averageScore = ref<number>()
const number = ref<number>(0)
let scores = ref<number[]>([])
const comment = ref<Comment>({
  "teacherName": '',
  "score": 0,
  "detail": []
})

const addScore = async (studentId:string) => {
  detailsT.value = []
  averageScore.value = 0
  selectVisible.value = true
  sid.value = studentId
  number.value = 0
  const result = await scoreOrGetInfo(pid,studentId,teacher.value.id)
  student.value = result.student
  processScoresT.value = result.processScores
  flag.value = result.flag
  processScoresT.value.forEach((ps,index) => {
    detailsT.value[index] = JSON.parse(ps.detail)
  })
  computedAverageScore()
}
const downloadFile = () => {
  getFile(pid,student.value.number,number.value)
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
      sum.value += (scores.value[i] * (items?.value[i].point / 100))
    }
  }
  comment.value.score = sum.value
  comment.value.teacherName = teacher.value.name
  const newDetail = JSON.stringify(comment.value)
  const processScore = ref({
    studentId: sid.value,
    processId: pid,
    teacherId: teacher.value.id,
    detail: newDetail
  })
  postProcessScore(processScore.value)

  const result = await scoreOrGetInfo(pid,sid.value,teacher.value.id)
  student.value = result.student
  processScoresT.value = result.processScores
  flag.value = result.flag
  processScoresT.value.forEach((ps,index) => {
    detailsT.value[index] = JSON.parse(ps.detail)
  })
  computedAverageScore()
  processScores.value = await getProcessScoresByPidAndTid(teacher.value.id,pid)

  comment.value.detail = []
  comment.value.teacherName = ''
  comment.value.score = 0
  scores.value = []
  selectVisible.value = false
}
const updateS = async () => {
  selectVisible.value = false
  await deleteProcessScore(pid,sid.value,teacher.value.id)
  const result = await scoreOrGetInfo(pid,sid.value,teacher.value.id)
  student.value = result.student
  processScoresT.value = result.processScores
  flag.value = result.flag
  processScoresT.value.forEach((ps,index) => {
    detailsT.value[index] = JSON.parse(ps.detail)
  })
  computedAverageScore()
  processScores.value = await getProcessScoresByPidAndTid(teacher.value.id,pid)

  comment.value.detail = []
  comment.value.teacherName = ''
  comment.value.score = 0
  scores.value = []
  selectVisible.value = true
}
function computedAverageScore() {
  let sum = 0
  detailsT.value.forEach(d => {
    sum += d.score
  })
  //@ts-ignore
  averageScore.value = (sum / detailsT.value.length).toFixed(2)
}
</script>
<template>
    <div>
        <el-radio-group v-model="pid" v-for="p in processes" :key="p.id" @change="confirmP">
            <el-radio :label="p.id" size="large" border>{{ p.processName }}</el-radio>
        </el-radio-group>
    </div>
    <div style="margin-top: 15px;" v-show="process.auth == 'audit'">
      <el-text type="info" size="large">第{{ teachers[0].groupId }}组评审：</el-text>
      <el-tag v-for="t in teachers" :key="t.id" class="mx-1" size="large">{{ t.name }} </el-tag>
      <el-text type="danger">该阶段评分占比{{ process.point }}%</el-text>
    </div>
    <div style="margin-top: 15px;" v-show="process.auth == 'tutor'">
      <el-text type="info" size="large">评审老师：<el-tag size="large">{{ teacher.name }}</el-tag></el-text>
      <el-text type="danger">该阶段评分占比{{ process.point }}%</el-text>
    </div>
    <div style="margin-top: 15px;">
      <el-text type="info" size="large">共需评分：<el-tag>{{ students.length }}</el-tag></el-text>
      <el-text type="info" size="large">您已评：<el-tag>{{ processScores.length }}</el-tag></el-text>
    </div>
    <div style="margin-top: 15px;" v-show="students.length == 0">
      <el-empty description="选择相应阶段，将会展示被评分学生信息和审核老师信息" />
    </div>
    <el-table :data="students" style="width: 100%; margin-top: 15px;" v-show="students.length > 0">
      <el-table-column type="index" label="#" width="90" />
      <el-table-column prop="name" label="姓名" width="90" />
      <el-table-column prop="queueNumber" label="组内顺序" width="90" />
      <el-table-column prop="teacherName" label="指导教师" width="180" />
      <el-table-column prop="projectTitle" label="毕设题目" width="270" />
      <el-table-column>
        <template #default="scope">
          <el-button size="large" type="success" @click="addScore(scope.row.id)">
            <el-icon><StarFilled /></el-icon>评分
          </el-button>
        </template>
      </el-table-column>
  </el-table>

  <el-dialog v-model="selectVisible" :title="student?.name">
    <div v-if="student != ''">
      <el-text type="warning" size="large">{{ process.processName }}阶段</el-text>
      <el-table :data="items" style="width: 100%; margin-top: 15px;" >
        <el-table-column prop="name" label="评分项" />
        <el-table-column prop="description" label="说明" width="400"/>
        <el-table-column prop="point" label="比例%"/>
        <el-table-column prop="point" label="得分" width="163">
          <template #default="scope">
            <el-input-number placeholder="默认值为0" :min="0" :max="100" v-model="scores[scope.row.number]"/>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 15px;">
        <el-text type="info" size="large"><el-icon><Management /></el-icon>附件：</el-text>
        <el-select v-model="number" placeholder="Select" style="width: 180px" >
          <el-option v-for="a in attach" :key="a.number" :value="a.number" :label="a.name">
            <span style="float: left">{{ a.name }}</span>
            <span style=" float: right; color: var(--el-text-color-secondary);font-size: 13px;">{{ a.ext }}文件</span>
          </el-option>
        </el-select>
        <el-button type="info" @click="downloadFile">查看</el-button>
      </div>
    </div>
    <div v-if="flag == 1">
      <h3>您已评分!</h3>
      <el-table :data="detailsT" style="width: 100%;">
        <el-table-column prop="teacherName" label="已评分老师" width="620"/>
        <el-table-column prop="score" label="得分"/>
      </el-table>
      <div style="margin-top: 15px;">
        <el-text type="danger" size="large">目前平均分：<el-tag size="large" type="danger">{{ averageScore }}</el-tag></el-text>
        <el-text type="danger" size="large" v-if="teachers.length - detailsT.length > 0 && process.auth == 'audit'">
          仍有{{ teachers.length - detailsT.length }}人未评</el-text>
        <el-text type="danger" size="large" v-if="teachers.length - detailsT.length == 0 || process.auth == 'tutor'">
          已全部完成评分</el-text>
      </div>
      <el-button type="danger" style="margin-top: 15px;" @click="updateS"><el-icon><Tools /></el-icon>重新评分</el-button>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="selectVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmScore" v-show="student != ''">确认分数</el-button>
      </span>
    </template>
  </el-dialog>
</template>