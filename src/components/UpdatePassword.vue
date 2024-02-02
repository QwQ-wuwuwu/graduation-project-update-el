<script setup lang="ts">
import {ref} from 'vue'
import axios from "@/axios"

const password1 = ref('')
const password2 = ref('')

const confirmPassword = async () => {
    if(password1.value == '' || password2.value == '') {
        alert('输入不能为空')
        return
    }
    if(password1.value != password2.value) {
        alert('两次输入密码不同')
        return
    }
    await axios({
        method: 'put',
        url: `/user/password/${password2.value}`
    }).then(() => {
        alert('修改成功')
    })
}
const resetPassword = () => {
    password1.value = ''
    password2.value = ''
}
</script>
<template>
    <el-row style="margin-top: 120px;">
        <el-col :span="6" :offset="9">
            <el-card shadow="always">
                <div style="margin-bottom: 15px; text-align: center;">
                    <el-text type="primary" size="large">修改用户密码</el-text> 
                </div>
                <el-form ref="ruleFormRef" status-icon label-width="120px" class="demo-ruleForm">
                    <el-form-item label="newPassword" prop="pass">
                        <el-input v-model="password1" required type="password" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label="Confirm" prop="checkPass">
                        <el-input v-model="password2" type="password" autocomplete="off" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="confirmPassword"><el-icon><SuccessFilled /></el-icon>Submit</el-button>
                        <el-button @click="resetPassword"><el-icon><CircleCloseFilled /></el-icon>Reset</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </el-col>
    </el-row>
</template>