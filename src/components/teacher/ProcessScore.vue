<script setup lang="ts">
import {getAllProcess, getStudents, getTeachers, scoreOrGetInfo, 
        postProcessScore, getFile, deleteProcessScore, getProcessScoresByPidAndTid,
        getProcessScores, getAllFiles} from '@/service/teacherService'
import { useProcessStore } from '@/stores/ProcessStore'
import { useTeacherStore } from '@/stores/TeacherStore'
import type { Student, Comment, Detail } from '@/types';
import { storeToRefs } from 'pinia';
import {ref, toRef} from 'vue'          

await getAllProcess()
await getTeachers()

const levelCount = ref<any>({
  score_90: 0,
  score_80: 0,
  score_70: 0,
  score_60: 0,
  score_last: 0,
})

interface StudentScore {
  student?: Student,
  score?: number
}
interface studentFile {
  student?: Student,
  file?: []
}
const studentsScores = ref<StudentScore[]>([])
const studentsFiles = ref<studentFile[]>([])

const files = toRef(await getAllFiles())
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
const processScoresPG = ref<any[]>([])
teacher.value = teacherStore.getTeacher(sessionStorage.getItem("number"))
const auth = ref('')

const confirmP = async () => {
  studentsScores.value = []
  studentsFiles.value = []
  psDetail.value = []
  process.value = processStore.getProcess(pid)
  auth.value = process.value.auth
  processScores.value = await getProcessScoresByPidAndTid(teacher.value.id,pid)
  processScoresPG.value = await getProcessScores(pid)
  const result:any = await getStudents(auth.value)                    
  students.value = result.students
  students.value.forEach(s => {
    const sf:studentFile = {student:s, file:[]}
    const newFiles = files.value.filter((f:any) => f.studentNumber == s.number && f.processId == pid)
    sf.file = newFiles
    studentsFiles.value.push(sf)
  })
  items.value = JSON.parse(process.value.items)
  attach.value = JSON.parse(process.value.studentAttach)

  computedStudentsScores()
  computedLevelCount()
}

const student = ref<any>()
const processScoresT = ref<any[]>([])
const flag = ref<number>(0)
const detailsT = ref<any[]>([])
const averageScore = ref<number>()
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
  const result = await scoreOrGetInfo(pid,studentId,teacher.value.id)
  student.value = result.student
  processScoresT.value = result.processScores
  flag.value = result.flag
  processScoresT.value.forEach((ps,index) => {
    detailsT.value[index] = JSON.parse(ps.detail)
  })
  computedAverageScore()
}

const selectFiles = ref<any[]>([])
const fileDialog = ref(false)

const getFilesInfo = (files:any) => {
  fileDialog.value = true
  selectFiles.value = files
}
const downloadFile = (sNumber:any,pNumber:any) => {
  getFile(pid,sNumber,pNumber)
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
  console.log(processScore.value)
  postProcessScore(processScore.value)

  processScoresPG.value = await getProcessScores(pid)
  await computedStudentsScores()
  computedLevelCount()
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
}
const updateS = async () => {
  await deleteProcessScore(pid,sid.value,teacher.value.id)
  const result = await scoreOrGetInfo(pid,sid.value,teacher.value.id)
  student.value = result.student
  processScoresT.value = result.processScores
  flag.value = result.flag
  processScoresT.value.forEach((ps,index) => {
    detailsT.value[index] = JSON.parse(ps.detail)
  })
  processScoresPG.value = await getProcessScores(pid)
  computedStudentsScores()
  computedLevelCount()
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
function computedStudentsScores() {
  studentsScores.value = []
  students.value.forEach(s => {
    const student:StudentScore = {student:s, score:0}
    const processScores = processScoresPG.value.filter(ps => ps.studentId == s.id)
    if(processScores.length == teachers.value.length && auth.value == 'audit') {
      let totalScore = 0
      processScores.forEach(ps => {
        const jsonDetail = JSON.parse(ps.detail)
        totalScore += parseFloat(jsonDetail.score)
      })
      student.score = parseFloat((totalScore / teachers.value.length).toFixed(2))
      if (student.score > 0) studentsScores.value.push(student)
    }
    if (auth.value == 'tutor') {
      let detail:any = {}
      processScores.forEach(ps => {
        detail = JSON.parse(ps.detail)
      })
      student.score = detail.score
      //@ts-ignore
      if (student.score > 0) studentsScores.value.push(student)
    }
  })
}
function computedLevelCount() {
  levelCount.value.score_90 = 0
  levelCount.value.score_80 = 0
  levelCount.value.score_70 = 0
  levelCount.value.score_60 = 0
  levelCount.value.score_last = 0
  studentsScores.value.forEach((s:any) => {
    if(s.score >= 90) {
      levelCount.value.score_90++
    } else if(s.score >= 80) {
      levelCount.value.score_80++
    } else if(s.score >= 70) {
      levelCount.value.score_70++
    } else if(s.score >= 60) {
      levelCount.value.score_60++
    } else {
      levelCount.value.score_last++
    }
  })
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
    <div style="margin-top: 15px;">
      优：<el-tag type="success">{{ levelCount.score_90 }}</el-tag>
      良：<el-tag>{{ levelCount.score_80 }}</el-tag>
      中：<el-tag type="info">{{ levelCount.score_70 }}</el-tag>
      差：<el-tag type="warning">{{ levelCount.score_60 }}</el-tag>
      不合格：<el-tag type="danger">{{ levelCount.score_last }}</el-tag>
    </div>
    <div style="margin-top: 15px;" v-show="students.length == 0">
      <el-empty description="选择相应阶段，将会展示被评分学生信息和审核老师信息" />
    </div>
    <el-table :data="studentsFiles" style="width: 100%; margin-top: 15px;" v-show="students.length > 0">
      <el-table-column type="index" label="#"/>
      <el-table-column prop="student.name" label="姓名"/>
      <el-table-column prop="student.queueNumber" label="组内顺序"/>
      <el-table-column prop="student.teacherName" label="指导教师"/>
      <el-table-column prop="student.projectTitle" label="毕设题目"/>
      <el-table-column>
        <template #default="scope">
          <el-button size="large" type="success" @click="addScore(scope.row.student.id)">
            <el-icon><StarFilled /></el-icon>评分
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

  <el-dialog v-model="selectVisible" :title="student?.name">
    <div v-if="student != ''">
      <el-text type="warning" size="large">{{ process.processName }}阶段</el-text>
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
    <div v-if="flag == 1">
      <h3>您已评分!</h3>
      <el-table :data="detailsT" style="width: 100%;">
        <el-table-column prop="teacherName" label="已评分老师"/>
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
  <el-dialog v-model="fileDialog" title="附件详情" width="800">
    <el-table :data="selectFiles">
      <el-table-column type="index" label="#"/>
      <el-table-column property="detail" label="附件名"/>
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