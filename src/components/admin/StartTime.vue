<script setup lang="ts">
import { ref } from 'vue'
import {updateTime, DateFormate} from '@/service/adminService'

const startTime = ref('')
const endTime = ref('')
const confirmTime = () => {
    const start = DateFormate(new Date(startTime.value))
    const end = DateFormate(new Date(endTime.value))
    updateTime(start,end)
}
</script>
<template>
    <el-row style="margin-left: 100px;">
        <el-col :span="18">
            <el-card shadow="always">
                <el-text type="primary" size="large">设置系统开始时间为：</el-text>
                <div class="block" style="margin-top: 15px; margin-bottom: 15px;">
                    <el-date-picker v-model="startTime" type="datetime" placeholder="Select date and time" />
                </div>
                <el-text type="primary" size="large">设置系统关闭时间为：</el-text>
                <div class="block" style="margin-top: 15px;">
                    <el-date-picker v-model="endTime" type="datetime" placeholder="Select date and time" />
                </div>
                <el-button type="primary" style="margin-top: 10px;" @click="confirmTime">
                    <el-icon><Select/></el-icon>
                    确定</el-button>
            </el-card>
        </el-col>
    </el-row>
</template>