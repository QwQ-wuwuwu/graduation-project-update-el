import type { Process } from '@/types'
import { defineStore } from 'pinia'
import {ref} from 'vue'

export const useProcessStore = defineStore('useProcessStore', () => {
  const processesS = ref<Process[]>([])
  
  const getProcess = (pid:any) => {
    const process = ref<Process>({})
    processesS.value.forEach((p) => {
      if(p.id == pid) {
        process.value = p
        return
      }
    })
    return process.value
  }
  
  return { processesS, getProcess }
})