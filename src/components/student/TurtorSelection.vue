<script setup lang="ts">
import {getAllTeachers, tutorSelection} from '@/service/studentService'
import {toRef, ref} from 'vue'

const result = await getAllTeachers()
const teachers = toRef(result.teachers)
const code = toRef(result.code)
const student:any = toRef(result.student)
const selectVisible = ref(false)
const tid = ref<string>('')
const tname = ref<string>('')

const selection = (id:string,name:string) => {
    selectVisible.value = true
    tid.value = id
    tname.value = name
}
const confirm = async () => {
    await tutorSelection(tid.value,tname.value)
    const x = await getAllTeachers()
    code.value = x.code.value
    student.value = x.student.value
    selectVisible.value = false
}
</script>
<template>
    <el-row v-if="code != 200" style="margin-top: 60px;">
        <el-col>
            <el-text type="success" size="large">系统已为您分配导师！</el-text> <br> <br>
            <el-text type="success" size="large">-指导教师-：</el-text>
            <el-tag type="danger" size="large" effect="light">
                {{ student?.teacherName }}
            </el-tag> <br> <br>
            <el-text type="success" size="large">-毕设答辩小组-：</el-text>
            <el-tag type="danger" size="large" effect="light">
                第{{ student?.groupId }}组
            </el-tag> <br> <br>
            <el-text v-show="student.queueNumber" type="success" size="large">-毕设答辩顺序-：
                <el-tag type="danger" size="large" effect="light">
                序号{{ student?.queueNumber }}
            </el-tag></el-text>
        </el-col>
    </el-row>
    <el-table v-if="code == 200" :data="teachers" style="width: 100%;" >
        <el-table-column type="index" label="#" />
        <el-table-column prop="name" label="姓名"/>
        <el-table-column prop="leftSelect" label="可选人数"/>
        <el-table-column prop="groupId" label="所在审核小组"/>
        <el-table-column>
            <template #default="scope">
                <el-button size="large" type="success" @click="selection(scope.row.id,scope.row.name)">
                    <el-icon><Select /></el-icon>选择</el-button>
            </template>
        </el-table-column>
    </el-table>
    
    <el-dialog v-model="selectVisible" title="注意！" width="30%">
        <span>
            您选择了
          <el-text type="primary" size="large">
            {{ tname }}
          </el-text>
          老师
          <br /> <br>
          确定后将不可更改
        </span>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="confirm">确定</el-button>
          </span>
        </template>
    </el-dialog>
</template>