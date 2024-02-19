<script setup lang="ts">
import { toRef } from 'vue';
import { RouterView } from 'vue-router'
import router from '@/router'

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
        <el-container >
            <el-header style="margin-top: 30px;">
                <el-row>
                    <el-col :span="8">
                        <div class="grid-content ep-bg-purple">
                            <el-text type="primary" size="large">
                                <el-button @click="toUpdatePassword" type="primary"><el-icon><UserFilled /></el-icon>{{ number }}</el-button>
                            </el-text>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="grid-content ep-bg-purple-light">
                            <el-text type="primary" size="large">毕设过程管理系统<el-icon><Reading /></el-icon></el-text>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="grid-content ep-bg-purple">
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
                                :router="true"
                                default-active="/admin/startTime"
                                class="el-menu-vertical-demo">
                            <el-menu-item index="/admin/startTime">
                                <el-icon><Timer /></el-icon>
                                    设定系统开放时间
                                </el-menu-item>
                                <el-menu-item index="/admin/addProcess">
                                    <el-icon><FolderAdd /></el-icon>
                                  添加过程细节
                                </el-menu-item>
                                <el-menu-item index="/admin/teacher">
                                  <el-icon><document /></el-icon>
                                  教师Excel文件导入
                                </el-menu-item>
                                <el-menu-item index="/admin/student">
                                    <el-icon><Management /></el-icon>
                                  学生Excle文件导入
                                </el-menu-item>
                                <el-menu-item index="/admin/changeGroup">
                                    <el-icon><Stamp /></el-icon>
                                  分组和答辩顺序
                                </el-menu-item>
                                <el-menu-item index="restPassword">
                                  <el-icon><setting /></el-icon>
                                  重置密码
                                </el-menu-item>
                                <el-menu-item index="/admin/projectTitle">
                                  <el-icon><setting /></el-icon>
                                  导入毕设题目
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
</style>