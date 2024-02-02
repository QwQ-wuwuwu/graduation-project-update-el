import { defineStore } from 'pinia'
import {ref} from 'vue'

export const useFilesStore = defineStore('useFilesStore', () => {
    const files = ref<any[]>([])
    return {files}
})