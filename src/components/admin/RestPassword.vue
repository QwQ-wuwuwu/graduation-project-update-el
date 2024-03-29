<script setup lang="ts">
import { Avatar, Lock } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { updateP1, updateP2 } from '@/service/adminService'

const number = ref('')
const password1 = ref('')
const password2 = ref('')

const updatePw1 = (num: string, pw1: string, pw2: string) => {
  updateP1(num, pw1, pw2)
  number.value = ''
}
const updatePw2 = (num: string) => {
  updateP2(num)
  number.value = ''
}
</script>
<template>
  <div class="demo-collapse" style="margin-top: 25px">
    <el-collapse accordion>
      <el-collapse-item title="快速重置密码" name="1">
        <div>
          <el-row>
            <el-col :span="12">
              <el-input
                v-model="number"
                :prefix-icon="Avatar"
                type="text"
                placeholder="输入账号,重置为初始密码"
            /></el-col>
            <el-button @click="updatePw2(number)" style="margin-left: 20px" type="warning">
              <el-icon><Setting /></el-icon>
              快速重置</el-button
            >
          </el-row>
        </div>
      </el-collapse-item>
      <el-collapse-item title="账号密码重置" name="2">
        <div>
          <el-row>
            <el-col :span="12">
              <el-input
                v-model="number"
                :prefix-icon="Avatar"
                style="margin-bottom: 15px"
                type="text"
                placeholder="输入账号"
              />
              <el-input
                v-model="password1"
                :prefix-icon="Lock"
                style="margin-bottom: 15px"
                type="password"
                placeholder="输入新密码"
              ></el-input>
              <el-input
                v-model="password2"
                :prefix-icon="Lock"
                type="password"
                placeholder="确认密码"
              ></el-input>
            </el-col>
          </el-row>
          <el-row style="margin-top: 15px">
            <el-col :span="4" :offset="3">
              <el-button
                @click="updatePw1(number, password1, password2)"
                style="margin-left: 20px"
                type="warning"
              >
                <el-icon><Setting /></el-icon>
                重置密码</el-button
              >
            </el-col>
          </el-row>
        </div>
      </el-collapse-item>
      <el-collapse-item title="Efficiency" name="3">
        <div>Simplify the process: keep operating process simple and intuitive;</div>
        <div>
          Definite and clear: enunciate your intentions clearly so that the users can quickly
          understand and make decisions;
        </div>
        <div>
          Easy to identify: the interface should be straightforward, which helps the users to
          identify and frees them from memorizing and recalling.
        </div>
      </el-collapse-item>
      <el-collapse-item title="Controllability" name="4">
        <div>
          Decision making: giving advices about operations is acceptable, but do not make decisions
          for the users;
        </div>
        <div>
          Controlled consequences: users should be granted the freedom to operate, including
          canceling, aborting or terminating current operation.
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
