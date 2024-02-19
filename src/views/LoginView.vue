<script setup lang="ts">
import { Avatar, Lock } from '@element-plus/icons-vue'
import {reactive} from 'vue'
import {useLoginStore} from '@/stores/login'
import {type User} from '@/types'
import axios from '@/axios'
import router from '@/router'

let user = reactive<User>({})
user.number = ''
user.password = ''
const useLogin = useLoginStore()

const Login = async () => {
    if (!user.number || !user.password) {
        alert("还有用户信息未输入")
        return
    }
    await axios({
        method: 'post',
        url: '/login',
        data: {
            number: user.number,
            password: user.password,
        }
    }).then(res => {
        if (res.data.code == 200) {
            const data = res.data
            const token = res.headers.token
            token && sessionStorage.setItem("token", token)
            useLogin.loginedUser = data.data.user
            user = data.data.user

            user.number && sessionStorage.setItem("number", user.number)
            user.name && sessionStorage.setItem("name", user.name)
            res.headers.role && sessionStorage.setItem("role", res.headers.role)
            if (user.role == 0) {
                router.push('/student')
            }
            if (user.role == 1) {
                router.push('/teacher')
            }
            if (user.role == 2) {
                router.push('/admin')
            }
        }
        else alert('账号或密码错误！')
    })
}
</script>
<template>
    <el-row style="margin-top: 100px;">
        <el-col :span="6" :offset="9" class="contain" style="margin-top: 25px;">
            <el-card shadow="always">
                <h3>毕设过程管理系统</h3>
                <el-text class="mx-1" size="large" type="primary">用户登录</el-text>
                <div style="margin-top: 15px;">
                    <el-input v-model.number="user.number" style="margin-top: 10px; width: auto;" type="text" 
                    :prefix-icon="Avatar" placeholder="*请输入账号"/>
                    <el-input v-model="user.password" style="margin-top: 20px; width: auto;" type="password" 
                    :prefix-icon="Lock" placeholder="*请输入密码"/>
                </div>
                <el-button type="primary" style="margin-top: 25px;" @click="Login"><el-icon>
                        <SwitchButton />
                </el-icon>Login</el-button>
            </el-card>
        </el-col>
    </el-row>
</template>
<style scoped>
.contain {
    text-align: center;
}
</style>