import { defineStore } from 'pinia'
import {ref} from 'vue'

export const useProcessScoreStore = defineStore('useProcessScoreStore', () => {
    const processScores = ref<any[]>([])
    return {processScores}
})