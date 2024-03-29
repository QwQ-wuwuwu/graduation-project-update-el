<script setup lang="ts">
import { toRef } from 'vue'
import router from '@/router'
import { RouterView } from 'vue-router'
import { getAllProcess } from '@/service/teacherService'
import { useProcessStore } from '@/stores/ProcessStore'
import { storeToRefs } from 'pinia'

getAllProcess()

const processStore = useProcessStore()
const processes = storeToRefs(processStore).processesS

const number = toRef(sessionStorage.getItem('name'))
const toUpdatePassword = () => {
  router.push('/updatePw')
}
const toUnlogin = () => {
  router.push('/')
}
</script>
<template>
  <div class="common-layout">
    <el-container>
      <el-header style="margin-top: 30px">
        <el-row>
          <el-col :span="8">
            <div class="grid-content ep-bg-purple">
              <el-text type="primary" size="large">
                <el-button @click="toUpdatePassword" type="primary"
                  ><el-icon><UserFilled /></el-icon>{{ number }}</el-button
                >
              </el-text>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content ep-bg-purple-light">
              <el-text type="primary" size="large"
                >毕设过程管理系统<el-icon><Reading /></el-icon
              ></el-text>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content ep-bg-purple">
              <el-button @click="toUnlogin" type="danger"
                ><el-icon>
                  <SwitchButton /> </el-icon
                >logout</el-button
              >
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 15px">
          <el-col :span="16" :offset="4">
            <div>
              <el-menu
                class="el-menu-demo"
                mode="horizontal"
                default-active="/teacher/groupScore"
                :ellipsis="false"
                :router="true"
              >
                <el-menu-item
                  style="margin: 0"
                  v-for="p in processes"
                  :key="p.id"
                  :index="'/teacher/score/' + p.id"
                >
                  <el-icon><Edit /></el-icon>{{ p.processName }}
                </el-menu-item>
                <div class="flex-grow" />
                <el-menu-item index="/teacher/groupScore"
                  ><el-icon><HelpFilled /></el-icon>
                  小组成绩统计
                </el-menu-item>
                <el-sub-menu :index="String(processes.length + 2)">
                  <template #title
                    ><el-icon><Menu /></el-icon>其他功能</template
                  >
                  <el-menu-item index="/teacher/unSelect"> 未选择学生信息 </el-menu-item>
                  <el-menu-item index="/teacher/select"> 指导学生信息 </el-menu-item>
                </el-sub-menu>
              </el-menu>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <el-row style="margin-top: 50px">
          <el-col :span="16" :offset="4">
            <Suspense><router-view :key="$route.fullPath" /></Suspense>
            <!--使用 key 属性强制重新渲染组件-->
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>
<style scoped>
.common-layout {
  text-align: center;
}
.flex-grow {
  flex-grow: 1;
}
</style>
