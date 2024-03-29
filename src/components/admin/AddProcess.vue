<script setup lang="ts">
import type { Process, ProcessItem, StudentAttach } from '@/types'
import { ref, computed } from 'vue'
import { addProcessService, listProcess, deleteProcess } from '@/service/adminService'
import { useProcessStore } from '@/stores/ProcessStore'
import { storeToRefs } from 'pinia'

listProcess()

const processStore = storeToRefs(useProcessStore()).processesS
const processR = ref<Process>({})
const processItemR = ref<ProcessItem>({})
const processItemsR = ref<ProcessItem[]>([])

const processAttachR = ref<StudentAttach>({})
const processAttachsR = ref<StudentAttach[]>([])

const addItem = () => {
  processItemR.value.number = processItemsR.value.length
  processItemsR.value.push(processItemR.value)
  processItemR.value = {}
  processR.value.items = processItemsR.value
}
const addStuAttach = () => {
  processAttachR.value.number = processR.value.studentAttach?.length ?? 0
  processAttachsR.value.push(processAttachR.value)
  processAttachR.value = {}
  processR.value.studentAttach = processAttachsR.value
}
const addProcess = () => {
  addProcessService(processR.value)
  processR.value = {}
  processItemR.value = {}
  processItemsR.value = []
  processAttachR.value = {}
  processAttachsR.value = []
}
const pointC = computed(() => {
  let points = 0
  processItemsR.value.forEach((i) => i.point && (points = i.point + points))
  return points == 100
})
const deleteP = (pid: string) => {
  deleteProcess(pid)
  location.reload()
}
</script>
<template>
  <el-row style="margin-left: auto">
    <el-col :span="18">
      <el-card shadow="always">
        <el-text type="primary" size="large">阶段详情设定</el-text>
        <el-form :model="processR" style="margin-top: 15px">
          <div>
            <el-row :gutter="10" style="margin-bottom: 10px">
              <el-col :span="6">
                <el-input v-model="processR.processName" placeholder="阶段名称" />
              </el-col>
              <el-col :span="6">
                <el-input v-model="processR.point" placeholder="阶段比例1~100" />
              </el-col>
              <el-col :span="6">
                <el-select v-model="processR.auth" placeholder="类型">
                  <el-option value="tutor" label="导师评分">导师评分</el-option>
                  <el-option value="audit" label="审核小组评分">审核小组评分</el-option>
                </el-select>
              </el-col>
            </el-row>
          </div>
          <el-row :gutter="10">
            <el-col :span="6">
              <el-input v-model="processItemR.name" placeholder="项名称" />
            </el-col>
            <el-col :span="6">
              <el-input v-model.number="processItemR.point" placeholder="比例1~100" type="number" />
            </el-col>
            <el-col :span="6">
              <el-input v-model="processItemR.description" placeholder="细节描述" />
            </el-col>
            <el-col :span="6">
              <el-button
                @click="addItem"
                type="success"
                :disabled="!(processItemR.name && processItemR.point)"
                >添加阶段项目</el-button
              >
            </el-col>
            <el-text type="danger" v-show="!pointC" style="margin-left: 15px">
              各项比例之和必须为100。{{ processItemsR }}
            </el-text>
          </el-row>
          <el-row :gutter="10" style="margin-top: 15px">
            <el-col :span="6">
              <el-input v-model="processAttachR.name" placeholder="学生附件名称" />
            </el-col>
            <el-col :span="6">
              <el-select v-model="processAttachR.ext" placeholder="附件扩展名">
                <el-option value=".pptx" label=".ppt/.pptx"></el-option>
                <el-option value=".docx" label=".doc/.docx"></el-option>
                <el-option value=".pdf" label=".pdf"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-input v-model="processAttachR.description" placeholder="附件用处" />
            </el-col>
            <el-col :span="6">
              <el-button @click="addStuAttach" type="success" :disabled="!processAttachR.name"
                >添加附件信息</el-button
              >
            </el-col>
            <el-text type="success" style="margin-left: 15px"> 阶段信息：{{ processR }} </el-text>
          </el-row>
          <el-button
            type="primary"
            style="margin-top: 15px"
            @click="addProcess"
            :disabled="!processR.auth || !processR.processName"
          >
            <el-icon><Select /></el-icon>
            确定</el-button
          >
        </el-form>
      </el-card>
      <el-table :data="processStore" style="width: 100%; margin-top: 15px">
        <el-table-column type="index" label="序号" />
        <el-table-column prop="processName" label="阶段" />
        <el-table-column prop="point" label="占比" />
        <el-table-column prop="auth" label="类型" />
        <el-table-column>
          <template #default="scope">
            <el-button size="small" type="primary">Detail</el-button>
            <el-button size="small" type="danger" @click="deleteP(scope.row.id)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>
