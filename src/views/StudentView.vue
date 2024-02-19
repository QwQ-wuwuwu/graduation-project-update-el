<script setup lang="ts">
import { toRef } from 'vue';
import router from '@/router'
import { RouterView } from 'vue-router'

const number = toRef(sessionStorage.getItem("name"))
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
        <el-header style="margin-top: 30px;">
            <el-row>
                <el-col :span="8">
                    <div class="grid-content ep-bg-purple" style="text-align: center;">
                        <el-text type="primary" size="large">
                            <el-button @click="toUpdatePassword" type="primary"><el-icon><UserFilled /></el-icon>{{number}}</el-button>
                        </el-text>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content ep-bg-purple-light">
                        <el-text type="primary" size="large">毕设过程管理系统<el-icon><Reading /></el-icon></el-text>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content ep-bg-purple" style="text-align: center;">
                        <el-button @click="toUnlogin" type="danger"><el-icon>
                            <SwitchButton />
                        </el-icon>logout</el-button>
                    </div>
                </el-col>
            </el-row>
            <el-row style="margin-top: 15px;">
                <el-col :span="16" :offset="4">
                    <div>
                        <el-menu class="el-menu-demo" mode="horizontal" default-active="/student/selection" 
                        :ellipsis="false"
                        :router="true">
                            <!-- <el-menu-item index="1"><el-icon><Promotion /></el-icon>
                                <router-link to="/student/selection" class="nav">选择导师</router-link></el-menu-item>
                            <div class="flex-grow" /> -->
                            <el-menu-item index="/student/selection"><el-icon><Promotion /></el-icon>
                                导师信息</el-menu-item>
                            <div class="flex-grow" />
                            <el-menu-item index="/student/upload"><el-icon><Management /></el-icon>
                                阶段文件上传</el-menu-item>
                        </el-menu>
                    </div>
                </el-col>
            </el-row>
        </el-header>
        <el-main>
            <el-row style="margin-top: 50px;">
                <el-col :span="16" :offset="4">
                    <Suspense><router-view/></Suspense>
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
  