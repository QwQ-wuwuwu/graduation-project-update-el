<script setup lang="ts">
import {ref} from 'vue'
import {getAllProcess,getFilesByStu} from '@/service/studentService'
import axios from "@/axios"
import { useProcessStore } from '@/stores/ProcessStore'
import {useFilesStore} from '@/stores/FilesStore'
import { storeToRefs } from 'pinia';

const processStore = useProcessStore()
const filesStore = useFilesStore()

await getAllProcess()
await getFilesByStu()

const processes:any = storeToRefs(processStore).processesS
const files:any = storeToRefs(filesStore).files
const process = ref<any>({})
const attach = ref<any>(null)
const myUpload = ref<any>(null);

const formData = new FormData()
const file = ref<any>()
const selection = ref<any>(null)

const selectVisible = ref(false)
const showInfo = () => {
  process.value = processStore.getProcess(selection.value.pid)
  attach.value = JSON.parse(process.value?.studentAttach)
  selectVisible.value = true
}

const confirm = () => {
  selectVisible.value = false
}
const extS = ref('')
const numberS = ref('')
const selectAttach = (ext:string,number:string) => {
  extS.value = ext
  numberS.value = number
}

const readFile = (f:any) => {
  file.value = f.raw // el-upload组件的文件
  const ext = file.value?.name.substring(file.value.name.lastIndexOf('.'))
  if(extS.value == '') {
    alert('未选择附件类型')
    return
  }
  if (extS.value.includes(ext)) {
    formData.append('file', file.value)
  } else {
    alert('文件格式错误')
    return
  }
}
const submitFile = async () => {
    if(file.value == null) {
        alert('未选择附件')
        return
    }
    if(selection.value?.pid == null) {
        alert('未选择阶段')
        return
    }
    if(extS.value == '') {
      alert('未选择附件类型')
      return
    }
    await axios({
        method: 'post',
        url: `/student/upload/${selection.value.pid}/${selection.value.pname}/${numberS.value}`,
        data: formData
    }).then(() => {
        alert('文件上传成功')
    })
    // 清空上一次输入
    formData.delete('file')
    file.value = null
    selection.value = null
    extS.value = ''
    myUpload.value?.clearFiles()
    await getFilesByStu()
    files.value = filesStore.files
}

</script>
<template>
  <div style="margin-top: 15px;">
    <el-radio-group v-model="selection" size="large" v-for="p in processes" :key="p.id" @change="showInfo">
      <el-radio-button :label="{pname:p.processName, pid:p.id}">{{ p.processName }}</el-radio-button>
    </el-radio-group>
  </div>

  <el-upload ref="myUpload" style="margin-top: 15px;"
    class="upload-demo" :auto-upload="false" :on-change="readFile"
    drag multiple>
    <el-icon style="color:lightskyblue" class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">
      将文件拖到此处，或<em>点击上传</em>
    </div>
    <template #tip>
      <div class="el-upload__tip">
        上传Word文档，演示PPT或PDF文件
      </div>
    </template>
  </el-upload>
  <div>
      <el-button style="margin-top: 15px;" @click="submitFile" type="primary">
    <el-icon><Upload /></el-icon>确认上传</el-button> <br>
  <el-text v-show="extS != ''" type="danger" size="small">{{ extS }}文件</el-text>
    </div>

  <el-table v-show="files.length > 0" :data="files" style="width: 100%" >
      <el-table-column type="index" label="序号" width="150" />
      <el-table-column prop="detail" label="已上传文件"/>
  </el-table>

  <br>
  <el-text type="danger" size="small">*上传同一阶段同一扩展名文件将自动覆盖前版</el-text>

  <el-dialog v-model="selectVisible" title="选择附件类型：" width="30%">
    <el-table :data="attach" style="width: 100%" >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="name" label="名称" width="100" />
      <el-table-column prop="ext" label="类型" width="80" />
      <el-table-column prop="description" label="附件用于" width="130" />
      <el-table-column>
        <template #default="scope">
          <el-button size="large" type="success" @click="selectAttach(scope.row.ext,scope.row.number)">
            <el-icon><Select /></el-icon>选择</el-button>
        </template>
      </el-table-column>
  </el-table>
  <template #footer>
    <span class="dialog-footer">
      <el-button type="primary" @click="confirm">确定</el-button>
    </span>
  </template>
  </el-dialog>
</template>