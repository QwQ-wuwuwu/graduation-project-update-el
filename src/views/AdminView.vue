<script setup lang="ts">
import { toRef } from 'vue';
import { RouterView, RouterLink } from 'vue-router'
import router from '@/router'

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
        <el-container >
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
                </el-header>
                <el-container>
                    <el-aside width="200px" style="margin-left: 200px;">
                        <el-row>
                            <el-col :span="24"><div class="grid-content ep-bg-purple-dark">
                                <el-menu
                                default-active="1"
                                class="el-menu-vertical-demo">
                            <el-menu-item index="1">
                                <el-icon><Timer /></el-icon>
                                    <span><router-link to="/admin/startTime" class="nav">设定系统开放时间</router-link></span>
                                </el-menu-item>
                                <el-menu-item index="2">
                                    <el-icon><FolderAdd /></el-icon>
                                  <span><router-link to="/admin/addProcess" class="nav">添加过程细节</router-link></span>
                                </el-menu-item>
                                <el-menu-item index="3">
                                  <el-icon><document /></el-icon>
                                  <span><router-link to="/admin/teacher" class="nav">教师Excel文件导入</router-link></span>
                                </el-menu-item>
                                <el-menu-item index="4">
                                    <el-icon><Management /></el-icon>
                                  <span><router-link to="/admin/student" class="nav">学生Excle文件导入</router-link></span>
                                </el-menu-item>
                                <el-menu-item index="5">
                                    <el-icon><Stamp /></el-icon>
                                  <span><router-link to="/admin/changeGroup" class="nav">分组和答辩顺序</router-link></span>
                                </el-menu-item>
                                <el-menu-item index="6">
                                  <el-icon><setting /></el-icon>
                                  <span><router-link to="restPassword" class="nav">重置密码</router-link></span>
                                </el-menu-item>
                                <el-menu-item index="7">
                                  <el-icon><setting /></el-icon>
                                  <span><router-link to="/admin/projectTitle" class="nav">导入毕设题目</router-link></span>
                                </el-menu-item>
                            </el-menu>
                            </div>
                            </el-col>
                        </el-row>
                    </el-aside>
                <el-main style="margin-right: 200px;">
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<style scoped>
.common-layout {
    text-align: center;
}
.nav {
    text-decoration: none;
    color: inherit;
}
</style>