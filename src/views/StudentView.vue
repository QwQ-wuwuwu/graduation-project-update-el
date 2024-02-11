<script setup lang="ts">
import { toRef } from 'vue';
import router from '@/router'
import { RouterView, RouterLink } from 'vue-router'

const number = toRef(sessionStorage.getItem("number"))
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
                    <div class="grid-content ep-bg-purple">
                        <el-text type="primary" size="large"><el-icon><UserFilled /></el-icon>：{{ number }}用户登录成功!</el-text>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content ep-bg-purple-light">
                        <el-text type="primary" size="large">毕设过程管理系统<el-icon><Reading /></el-icon></el-text>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content ep-bg-purple">
                        <el-button @click="toUpdatePassword" type="primary"><el-icon><Setting /></el-icon>修改密码</el-button>
                        <el-button @click="toUnlogin" type="danger"><el-icon>
                            <SwitchButton />
                        </el-icon>logout</el-button>
                    </div>
                </el-col>
            </el-row>
            <el-row style="margin-top: 15px;">
                <el-col :span="12" :offset="5">
                    <div>
                        <el-menu class="el-menu-demo" mode="horizontal" default-active="1" :ellipsis="false">
                            <el-menu-item index="1"><el-icon><Promotion /></el-icon>
                                <router-link to="/student/selection" class="nav">选择导师</router-link></el-menu-item>
                            <div class="flex-grow" />
                            <el-menu-item index="2"><el-icon><Management /></el-icon>
                                <router-link to="/student/upload" class="nav">阶段文件上传</router-link></el-menu-item>
                        </el-menu>
                    </div>
                </el-col>
            </el-row>
        </el-header>
        <el-main>
            <el-row style="margin-top: 50px;">
                <el-col :span="12" :offset="5">
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
.nav {
    text-decoration: none;
    color: inherit;
}
</style>
  